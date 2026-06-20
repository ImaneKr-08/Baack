import { PrismaService } from "src/prisma/prisma.service";
import { CreateAppointmentDto } from "./dto/create-appointments.dto";
import { Injectable } from "@nestjs/common/decorators/core/injectable.decorator";

@Injectable()
export class AppointmentsService {
    constructor(private prisma: PrismaService) { }

    async findAll() {
        const sessions = await this.prisma.therapistSession.findMany({
            include: {
                student: {
                    include: {
                        user: true,
                    },
                },
                therapist: {
                    include: {
                        user: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        return sessions.map((s) => ({
            id: s.id,
            studentId: s.studentId,

            student: {
                firstName: s.student.user.firstName,
                lastName: s.student.user.lastName,
                email: s.student.user.email,
            },
            therapistId: s.therapistId,

            therapist: {
                firstName: s.therapist.user.firstName,
                lastName: s.therapist.user.lastName,
                email: s.therapist.user.email,
            },
            type: s.type,
            notes: (s as any).notes,
            dateTime: s.dateTime,
            status: s.status,
            createdAt: s.createdAt,
        }));
    }

    async createRequest(dto: CreateAppointmentDto) {
        return this.prisma.therapistSession.create({
            data: {
                studentId: dto.studentId,
                type: dto.type,
                notes: dto.notes,
                therapistId: dto.therapistId,
                status: 'PENDING',
            },
        });
    }

    async accept(id: number, dateTime: string) {
        return this.prisma.therapistSession.update({
            where: { id },
            data: {
                status: 'SCHEDULED',
                dateTime: new Date(dateTime),
            },
        });
    }

    async decline(id: number) {
        return this.prisma.therapistSession.update({
            where: { id },
            data: {
                status: 'DECLINED',
            },
        });
    }
    async remove(id: number) {
        return this.prisma.therapistSession.delete({
            where: { id },
        });
    }
    async getMyPatients(userId: number) {
        const therapist = await this.prisma.therapist.findUnique({
            where: {
                userId,
            },
        });

        if (!therapist) {
            return [];
        }

        const sessions = await this.prisma.therapistSession.findMany({
            where: {
                therapistId: therapist.id,
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
                    studentId: session.student.id,
                    firstName: session.student.user.firstName,
                    lastName: session.student.user.lastName,
                    email: session.student.user.email,
                });
            }
        });

        return [...uniquePatients.values()];
    }
    async getPatientSessions(studentId: number) {
        return this.prisma.therapistSession.findMany({
            where: {
                studentId,
            },
            include: {
                therapist: {
                    include: {
                        user: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
    }
    async createSession(data: {
        studentId: number;
        therapistId: number;
        sessionSummary: string;
        observations?: string;
        recommendations?: string;
        stressAssessment?: any;
    }) {
        return this.prisma.therapistSession.create({
            data: {
                studentId: data.studentId,
                therapistId: data.therapistId,

                type: 'CONSULTATION',
                status: 'SCHEDULED',

                sessionSummary: data.sessionSummary,
                observations: data.observations,
                recommendations: data.recommendations,
                stressAssessment: data.stressAssessment,
            },
        });
    }

    async updateSession(
        id: number,
        data: {
            sessionSummary?: string;
            observations?: string;
            recommendations?: string;
            stressAssessment?: any;
        },
    ) {
        return this.prisma.therapistSession.update({
            where: { id },
            data,
        });
    }

    async deleteSession(id: number) {
        return this.prisma.therapistSession.delete({
            where: { id },
        });
    }
}