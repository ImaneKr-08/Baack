import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RealtimeGateway } from '../realtime/gateways/realtime.gateways';
import { StressDataDto } from './dto/stress-data.dto';
import { StressLevel } from '@prisma/client';

@Injectable()
export class MlService {
  constructor(
    private prisma: PrismaService,
    private realtimeGateway: RealtimeGateway,
  ) {}

  async processStressData(dto: StressDataDto) {
    const { esp32_id, stress_level, confidence, normalized } = dto;

    const student = await this.prisma.student.findUnique({
      where: { braceletId: esp32_id },
    });

    if (!student) {
      throw new NotFoundException(
        `No student assigned to bracelet ID ${esp32_id}`,
      );
    }

    let mappedLevel: StressLevel = StressLevel.BASELINE;
    const lowerLevel = stress_level.toLowerCase();
    if (lowerLevel.includes('high')) {
      mappedLevel = StressLevel.HIGH_STRESS;
    } else if (lowerLevel.includes('mild')) {
      mappedLevel = StressLevel.MILD_STRESS;
    }

    const heartRate = Math.round(normalized.hr_norm * 50 + 60);

    await this.prisma.student.update({
      where: { id: student.id },
      data: {
        heartRate,
        stressScore: confidence,
        stressLevel: mappedLevel,
        connected: true,
        lastUpdate: new Date(),
      },
    });

    const activeSession = await this.prisma.monitoringSession.findFirst({
      where: {
        active: true,
        exam: {
          examStudents: {
            some: {
              studentId: student.id,
            },
          },
        },
      },
    });

    if (activeSession) {
      await this.prisma.telemetryHistory.create({
        data: {
          studentId: student.id,
          sessionId: activeSession.id,
          braceletId: esp32_id,
          heartRate,
          stressScore: confidence,
          stressLevel: mappedLevel,
        },
      });
    }

    let displayLevel = 'Baseline';
    if (mappedLevel === StressLevel.HIGH_STRESS) {
      displayLevel = 'High Stress';
    } else if (mappedLevel === StressLevel.MILD_STRESS) {
      displayLevel = 'Mild Stress';
    }

    this.realtimeGateway.sendTelemetryUpdate({
      braceletId: esp32_id,
      studentId: student.id,
      heartRate,
      stressScore: confidence,
      stressLevel: displayLevel,
    });

    return {
      success: true,
      message: 'Telemetry processed and broadcasted',
      data: {
        studentId: student.id,
        heartRate,
        stressLevel: displayLevel,
        inActiveSession: !!activeSession,
      },
    };
  }

  async pairDevice(deviceId: string, userId: number | string) {
    let student;
    
    if (typeof userId === 'number' || (typeof userId === 'string' && !isNaN(parseInt(userId, 10)) && userId.match(/^[0-9]+$/))) {
      const id = typeof userId === 'string' ? parseInt(userId, 10) : userId;
      student = await this.prisma.student.findUnique({
        where: { id },
      });
    }

    if (!student && typeof userId === 'string') {
      student = await this.prisma.student.findUnique({
        where: { studentCode: userId },
      });
    }

    if (!student) {
      throw new NotFoundException(`Student ${userId} not found`);
    }

    const studentId = student.id;

    // Unpair if the device is already assigned to another student
    const existing = await this.prisma.student.findUnique({
      where: { braceletId: deviceId },
    });

    if (existing && existing.id !== studentId) {
      await this.prisma.student.update({
        where: { id: existing.id },
        data: { braceletId: null, connected: false },
      });
      this.realtimeGateway.sendStudentDisconnected({ studentId: existing.id });
    }

    await this.prisma.student.update({
      where: { id: studentId },
      data: { braceletId: deviceId, connected: true },
    });

    this.realtimeGateway.sendStudentConnected({
      studentId,
      braceletId: deviceId,
    });

    return { success: true, message: 'Device paired successfully' };
  }
}
