import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TherapistsService {
    constructor(private prisma: PrismaService) { }

    async findAll() {
        return this.prisma.therapist.findMany({
            include: {
                user: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                    },
                },
            },
        });
    }

    async create(userId: number) {
        return this.prisma.therapist.create({
            data: {
                userId,
            },
            include: {
                user: true,
            },
        });
    }
    async getPatientsForTherapist(therapistId: number) {
  const sessions = await this.prisma.therapistSession.findMany({
    where: {
      therapistId,
    },
    include: {
      student: {
        include: {
          user: true,
        },
      },
    },
  });

  const uniquePatients = new Map();

  sessions.forEach((session) => {
    if (!uniquePatients.has(session.studentId)) {
      uniquePatients.set(session.studentId, {
        id: session.student.id,
        studentId: session.studentId,
        firstName: session.student.user.firstName,
        lastName: session.student.user.lastName,
        email: session.student.user.email,
      });
    }
  });

  return Array.from(uniquePatients.values());
}
}