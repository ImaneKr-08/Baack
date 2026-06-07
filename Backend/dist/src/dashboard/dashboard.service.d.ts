import { PrismaService } from '../prisma/prisma.service';
export declare class DashboardService {
    private prisma;
    constructor(prisma: PrismaService);
    getAdminStats(): Promise<{
        totalStudents: number;
        totalProfessors: number;
        totalClassrooms: number;
        totalExams: number;
        activeSessions: number;
    }>;
    getProfessorStats(userId: number): Promise<{
        assignedExams: number;
        activeSessions: number;
        monitoredStudents: number;
    }>;
}
