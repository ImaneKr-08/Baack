import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  async getAdminStats() {
    const [totalStudents, totalProfessors, totalClassrooms, totalExams, activeSessions] = await Promise.all([
      this.prisma.student.count(),
      this.prisma.professor.count(),
      this.prisma.classroom.count(),
      this.prisma.exam.count(),
      this.prisma.monitoringSession.count({ where: { active: true } }),
    ]);

    return {
      totalStudents,
      totalProfessors,
      totalClassrooms,
      totalExams,
      activeSessions,
    };
  }

  async getProfessorStats(userId: number) {
    const professor = await this.prisma.professor.findUnique({
      where: { userId },
    });

    if (!professor) {
      throw new ForbiddenException('No professor profile linked to this user account');
    }

    const [assignedExams, activeSessions, monitoredStudents] = await Promise.all([
      this.prisma.exam.count({
        where: { professorId: professor.id },
      }),
      this.prisma.monitoringSession.count({
        where: {
          active: true,
          exam: { professorId: professor.id },
        },
      }),
      this.prisma.examStudent.count({
        where: {
          exam: {
            professorId: professor.id,
            status: 'ONGOING',
          },
        },
      }),
    ]);

    return {
      assignedExams,
      activeSessions,
      monitoredStudents,
    };
  }
}
