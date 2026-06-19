import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RealtimeGateway } from '../realtime/gateways/realtime.gateways';
import { StressDataDto } from './dto/stress-data.dto';
import { StressLevel, Student } from '@prisma/client';

@Injectable()
export class MlService {
  private readonly logger = new Logger(MlService.name);

  constructor(
    private prisma: PrismaService,
    private realtimeGateway: RealtimeGateway,
  ) {}

  async processStressData(dto: StressDataDto) {
    const {
  esp32_id,
  stress_level,
  confidence,
  raw,
  normalized,
} = dto;

    this.logger.debug(
      `Processing stress data for braceletId=${esp32_id}, rawStressLevel=${stress_level}, confidence=${confidence}, hrNorm=${normalized?.hr_norm}`,
    );

    const student = await this.prisma.student.findUnique({
      where: { braceletId: esp32_id },
    });

    if (!student) {
      this.logger.warn(
        `Stress data rejected: no student is assigned to braceletId=${esp32_id}`,
      );
      throw new NotFoundException(
        `No student assigned to bracelet ID ${esp32_id}`,
      );
    }

    this.logger.debug(
      `Matched braceletId=${esp32_id} to studentId=${student.id}, studentCode=${student.studentCode}, connected=${student.connected}`,
    );

    let mappedLevel: StressLevel = StressLevel.BASELINE;
    const lowerLevel = stress_level.toLowerCase();
    if (lowerLevel.includes('high')) {
      mappedLevel = StressLevel.HIGH_STRESS;
    } else if (lowerLevel.includes('mild')) {
      mappedLevel = StressLevel.MILD_STRESS;
    }

const heartRate = Math.round(raw.hr);

const hrv = Math.round(raw.hrv);

const gsr = raw.gsr;
    this.logger.debug(
  `Mapped stress data for studentId=${student.id}: level=${mappedLevel}, hr=${heartRate}, hrv=${hrv}, gsr=${gsr}`,
);

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

    this.logger.debug(
      `Updated student telemetry state for studentId=${student.id}, braceletId=${esp32_id}`,
    );

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

    this.logger.debug(
      `Active monitoring session lookup for studentId=${student.id}: ${activeSession ? `sessionId=${activeSession.id}` : 'none found'}`,
    );

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
      this.logger.debug(
        `Created telemetry history row for studentId=${student.id}, sessionId=${activeSession.id}, braceletId=${esp32_id}`,
      );
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
  hrv,
  gsr,

  stressScore: confidence,
  stressLevel: displayLevel,

  timestamp: dto.timestamp,
});

    this.logger.debug(
      `Telemetry broadcast requested for studentId=${student.id}, braceletId=${esp32_id}, displayLevel=${displayLevel}`,
    );

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
    let student: Student | null = null;

    this.logger.debug(
      `Pair-device started from ML webhook: deviceId=${deviceId}, userId=${userId}, userIdType=${typeof userId}`,
    );

    if (
      typeof userId === 'number' ||
      (typeof userId === 'string' &&
        !isNaN(parseInt(userId, 10)) &&
        userId.match(/^[0-9]+$/))
    ) {
      const id = typeof userId === 'string' ? parseInt(userId, 10) : userId;
      this.logger.debug(`Looking up student by numeric id=${id}`);
      student = await this.prisma.student.findUnique({
        where: { id },
      });
    }

    if (!student && typeof userId === 'string') {
      this.logger.debug(`Looking up student by studentCode=${userId}`);
      student = await this.prisma.student.findUnique({
        where: { studentCode: userId },
      });
    }

    if (!student) {
      this.logger.warn(
        `Pair-device failed: student not found for userId=${userId}, deviceId=${deviceId}`,
      );
      throw new NotFoundException(`Student ${userId} not found`);
    }

    const studentId = student.id;

    this.logger.debug(
      `Pair-device matched target studentId=${studentId}, studentCode=${student.studentCode}, oldBraceletId=${student.braceletId}`,
    );

    // Unpair if the device is already assigned to another student
    const existing = await this.prisma.student.findUnique({
      where: { braceletId: deviceId },
    });

    this.logger.debug(
      `Existing bracelet assignment lookup for deviceId=${deviceId}: ${existing ? `studentId=${existing.id}` : 'none found'}`,
    );

    if (existing && existing.id !== studentId) {
      this.logger.warn(
        `DeviceId=${deviceId} is assigned to studentId=${existing.id}; unpairing before assigning to studentId=${studentId}`,
      );
      await this.prisma.student.update({
        where: { id: existing.id },
        data: { braceletId: null, connected: false },
      });
      this.realtimeGateway.sendStudentDisconnected({ studentId: existing.id });
      this.logger.debug(
        `Disconnected previous studentId=${existing.id} from deviceId=${deviceId}`,
      );
    }

    await this.prisma.student.update({
      where: { id: studentId },
      data: { braceletId: deviceId, connected: true },
    });

    this.logger.debug(
      `Assigned deviceId=${deviceId} to studentId=${studentId} and marked connected=true`,
    );

    this.realtimeGateway.sendStudentConnected({
      studentId,
      braceletId: deviceId,
    });

    this.logger.debug(
      `Student connected broadcast requested for studentId=${studentId}, deviceId=${deviceId}`,
    );

    return { success: true, message: 'Device paired successfully' };
  }
}
