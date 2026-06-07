import { PrismaService } from '../prisma/prisma.service';
import { CreateExamDto } from './dto/create-exam.dto';
import { UpdateExamDto } from './dto/update-exam.dto';
import { RealtimeGateway } from '../realtime/gateways/realtime.gateways';
export declare class ExamsService {
    private prisma;
    private realtimeGateway;
    constructor(prisma: PrismaService, realtimeGateway: RealtimeGateway);
    create(createExamDto: CreateExamDto): Promise<{
        id: number;
        title: string;
        module: string;
        examDate: Date;
        startTime: Date;
        endTime: Date;
        classroomId: number;
        professorId: number;
        status: import("@prisma/client").$Enums.ExamStatus;
    }>;
    findAll(): Promise<({
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
        _count: {
            examStudents: number;
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
    })[]>;
    findOne(id: number): Promise<{
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
        examStudents: ({
            student: {
                id: number;
                email: string;
                password: string;
                createdAt: Date;
                updatedAt: Date;
                firstName: string;
                lastName: string;
                department: string;
                studentCode: string;
                braceletId: string | null;
                heartRate: number | null;
                stressScore: number | null;
                stressLevel: import("@prisma/client").$Enums.StressLevel | null;
                connected: boolean;
                lastUpdate: Date | null;
            };
            table: {
                id: number;
                classroomId: number;
                qrCode: string | null;
                positionX: number;
                positionY: number;
            };
        } & {
            id: number;
            examId: number;
            studentId: number;
            tableId: number;
        })[];
        monitoringSessions: {
            id: number;
            startedAt: Date;
            endedAt: Date | null;
            active: boolean;
            examId: number;
        }[];
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
    }>;
    update(id: number, updateExamDto: UpdateExamDto): Promise<{
        id: number;
        title: string;
        module: string;
        examDate: Date;
        startTime: Date;
        endTime: Date;
        classroomId: number;
        professorId: number;
        status: import("@prisma/client").$Enums.ExamStatus;
    }>;
    remove(id: number): Promise<{
        id: number;
        title: string;
        module: string;
        examDate: Date;
        startTime: Date;
        endTime: Date;
        classroomId: number;
        professorId: number;
        status: import("@prisma/client").$Enums.ExamStatus;
    }>;
    assignProfessor(id: number, professorId: number): Promise<{
        id: number;
        title: string;
        module: string;
        examDate: Date;
        startTime: Date;
        endTime: Date;
        classroomId: number;
        professorId: number;
        status: import("@prisma/client").$Enums.ExamStatus;
    }>;
    assignStudents(id: number, assignments: {
        studentId: number;
        tableId: number;
    }[]): Promise<any[]>;
    start(id: number): Promise<{
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
    end(id: number): Promise<{
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
}
