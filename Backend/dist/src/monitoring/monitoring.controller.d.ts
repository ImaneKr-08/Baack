import { MonitoringService } from './monitoring.service';
export declare class MonitoringController {
    private readonly monitoringService;
    constructor(monitoringService: MonitoringService);
    startSession(examId: number): Promise<{
        message: string;
        exam: {
            id: number;
            title: string;
            module: string;
            examDate: Date;
            startTime: Date;
            endTime: Date;
            classroomId: number;
            professorId: number;
            status: import("@prisma/client").$Enums.ExamStatus;
        };
        session: {
            id: number;
            startedAt: Date;
            endedAt: Date | null;
            active: boolean;
            examId: number;
        };
    }>;
    endSession(sessionId: number): Promise<{
        message: string;
        exam: {
            id: number;
            title: string;
            module: string;
            examDate: Date;
            startTime: Date;
            endTime: Date;
            classroomId: number;
            professorId: number;
            status: import("@prisma/client").$Enums.ExamStatus;
        };
        session: any;
    }>;
    getSession(id: number): Promise<{
        exam: {
            professor: {
                id: number;
                email: string;
                userId: number;
                firstName: string;
                lastName: string;
                department: string;
            };
            classroom: {
                id: number;
                name: string;
                building: string;
                capacity: number;
                rows: number;
                columns: number;
            };
        } & {
            id: number;
            title: string;
            module: string;
            examDate: Date;
            startTime: Date;
            endTime: Date;
            classroomId: number;
            professorId: number;
            status: import("@prisma/client").$Enums.ExamStatus;
        };
    } & {
        id: number;
        startedAt: Date;
        endedAt: Date | null;
        active: boolean;
        examId: number;
    }>;
    getSessionStudents(id: number): Promise<{
        assignmentId: number;
        studentId: number;
        studentCode: string;
        firstName: string;
        lastName: string;
        email: string;
        department: string;
        braceletId: string | null;
        heartRate: number | null;
        stressScore: number | null;
        stressLevel: import("@prisma/client").$Enums.StressLevel | null;
        connected: boolean;
        lastUpdate: Date | null;
        table: {
            id: number;
            positionX: number;
            positionY: number;
        };
    }[]>;
    getSessionHistory(id: number): Promise<({
        student: {
            firstName: string;
            lastName: string;
            studentCode: string;
        };
    } & {
        id: number;
        braceletId: string;
        heartRate: number;
        stressScore: number;
        stressLevel: import("@prisma/client").$Enums.StressLevel;
        studentId: number;
        timestamp: Date;
        sessionId: number;
    })[]>;
    getSessionStatistics(id: number): Promise<{
        sessionId: number;
        examId: number;
        totalRecords: number;
        averageHeartRate: number;
        maxHeartRate: number;
        minHeartRate: number;
        averageStressScore: number;
        maxStressScore: number;
        minStressScore: number;
        stressLevelsDistribution: {
            BASELINE: number;
            MILD_STRESS: number;
            HIGH_STRESS: number;
        };
        studentSummaries: {
            studentId: number;
            studentCode: string;
            firstName: string;
            lastName: string;
            averageHeartRate: number;
            averageStressScore: number;
            recordsCount: number;
        }[];
    }>;
}
