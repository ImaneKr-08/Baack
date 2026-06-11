import { PrismaService } from '../prisma/prisma.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
export declare class StudentsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createStudentDto: CreateStudentDto): Promise<{
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
        seatNumber: string | null;
    }>;
    findAll(paginationDto: PaginationDto, department?: string): Promise<{
        items: {
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
            seatNumber: string | null;
        }[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    findOne(id: number): Promise<{
        examStudents: ({
            table: {
                id: number;
                positionX: number;
                positionY: number;
                classroomId: number;
                qrCode: string | null;
            };
            exam: {
                id: number;
                title: string;
                classroomId: number;
                module: string;
                examDate: Date;
                startTime: Date;
                endTime: Date;
                professorId: number;
                status: import("@prisma/client").$Enums.ExamStatus;
            };
        } & {
            id: number;
            examId: number;
            studentId: number;
            tableId: number;
        })[];
    } & {
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
        seatNumber: string | null;
    }>;
    update(id: number, updateStudentDto: UpdateStudentDto): Promise<{
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
        seatNumber: string | null;
    }>;
    remove(id: number): Promise<{
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
        seatNumber: string | null;
    }>;
}
