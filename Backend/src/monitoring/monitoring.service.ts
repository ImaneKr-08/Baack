import { Injectable, NotFoundException, BadRequestException, Inject, forwardRef } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ExamsService } from '../exams/exams.service';

@Injectable()
export class MonitoringService {
  constructor(
    private prisma: PrismaService,
    @Inject(forwardRef(() => ExamsService))
    private examsService: ExamsService,
  ) {}

  async startSession(examId: number) {
    return this.examsService.start(examId);
  }

  async endSession(sessionId: number) {
    const session = await this.prisma.monitoringSession.findUnique({
      where: { id: sessionId },
    });
    if (!session) {
      throw new NotFoundException(`Monitoring session with ID ${sessionId} not found`);
    }
    if (!session.active) {
      throw new BadRequestException('Monitoring session is already inactive');
    }
    return this.examsService.end(session.examId);
  }

  async getSession(id: number) {
    const session = await this.prisma.monitoringSession.findUnique({
      where: { id },
      include: {
        exam: {
          include: {
            classroom: true,
            professor: true,
          },
        },
      },
    });

    if (!session) {
      throw new NotFoundException(`Monitoring session with ID ${id} not found`);
    }

    return session;
  }

  async getSessionStudents(sessionId: number) {
    const session = await this.getSession(sessionId);

    const examStudents = await this.prisma.examStudent.findMany({
      where: { examId: session.examId },
      include: {
        student: true,
        table: true,
      },
    });

    return examStudents.map((es) => ({
      assignmentId: es.id,
      studentId: es.studentId,
      studentCode: es.student.studentCode,
      firstName: es.student.firstName,
      lastName: es.student.lastName,
      email: es.student.email,
      department: es.student.department,
      braceletId: es.student.braceletId,
      heartRate: es.student.heartRate,
      stressScore: es.student.stressScore,
      stressLevel: es.student.stressLevel,
      connected: es.student.connected,
      lastUpdate: es.student.lastUpdate,
      table: {
        id: es.table.id,
        positionX: es.table.positionX,
        positionY: es.table.positionY,
      },
    }));
  }

  async getSessionHistory(sessionId: number) {
    await this.getSession(sessionId);

    return this.prisma.telemetryHistory.findMany({
      where: { sessionId },
      include: {
        student: {
          select: {
            firstName: true,
            lastName: true,
            studentCode: true,
          },
        },
      },
      orderBy: { timestamp: 'desc' },
    });
  }

  async getSessionStatistics(sessionId: number) {
    const session = await this.getSession(sessionId);

    const telemetry = await this.prisma.telemetryHistory.findMany({
      where: { sessionId },
    });

    if (telemetry.length === 0) {
      return {
        sessionId,
        examId: session.examId,
        totalRecords: 0,
        averageHeartRate: 0,
        maxHeartRate: 0,
        minHeartRate: 0,
        averageStressScore: 0,
        maxStressScore: 0,
        minStressScore: 0,
        stressLevelsDistribution: {
          BASELINE: 0,
          MILD_STRESS: 0,
          HIGH_STRESS: 0,
        },
        studentSummaries: [],
      };
    }

    let totalHr = 0;
    let maxHr = 0;
    let minHr = 999;
    let totalStress = 0;
    let maxStress = 0;
    let minStress = 999;

    const stressDist = { BASELINE: 0, MILD_STRESS: 0, HIGH_STRESS: 0 };
    const studentData: Record<number, { hrSum: number; stressSum: number; count: number; studentId: number }> = {};

    telemetry.forEach((t) => {
      totalHr += t.heartRate;
      if (t.heartRate > maxHr) maxHr = t.heartRate;
      if (t.heartRate < minHr) minHr = t.heartRate;

      totalStress += t.stressScore;
      if (t.stressScore > maxStress) maxStress = t.stressScore;
      if (t.stressScore < minStress) minStress = t.stressScore;

      if (t.stressLevel in stressDist) {
        stressDist[t.stressLevel as keyof typeof stressDist]++;
      }

      if (!studentData[t.studentId]) {
        studentData[t.studentId] = { hrSum: 0, stressSum: 0, count: 0, studentId: t.studentId };
      }
      studentData[t.studentId].hrSum += t.heartRate;
      studentData[t.studentId].stressSum += t.stressScore;
      studentData[t.studentId].count++;
    });

    const studentIds = Object.keys(studentData).map(Number);
    const students = await this.prisma.student.findMany({
      where: { id: { in: studentIds } },
      select: { id: true, firstName: true, lastName: true, studentCode: true },
    });

    const studentSummaries = students.map((s) => {
      const data = studentData[s.id];
      return {
        studentId: s.id,
        studentCode: s.studentCode,
        firstName: s.firstName,
        lastName: s.lastName,
        averageHeartRate: Math.round(data.hrSum / data.count),
        averageStressScore: parseFloat((data.stressSum / data.count).toFixed(2)),
        recordsCount: data.count,
      };
    });

    return {
      sessionId,
      examId: session.examId,
      totalRecords: telemetry.length,
      averageHeartRate: Math.round(totalHr / telemetry.length),
      maxHeartRate: maxHr,
      minHeartRate: minHr === 999 ? 0 : minHr,
      averageStressScore: parseFloat((totalStress / telemetry.length).toFixed(2)),
      maxStressScore: maxStress,
      minStressScore: minStress === 999 ? 0 : minStress,
      stressLevelsDistribution: stressDist,
      studentSummaries,
    };
  }
}
