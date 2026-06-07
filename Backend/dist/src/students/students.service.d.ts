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
        studentCode: string;
        braceletId: string | null;
        firstName: string;
        lastName: string;
        password: string;
        department: string;
        heartRate: number | null;
        stressScore: number | null;
        stressLevel: import("@prisma/client").$Enums.StressLevel | null;
        connected: boolean;
        lastUpdate: Date | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    findAll(paginationDto: PaginationDto, department?: string): Promise<{
        items: {
            id: number;
            email: string;
            studentCode: string;
            braceletId: string | null;
            firstName: string;
            lastName: string;
            password: string;
            department: string;
            heartRate: number | null;
            stressScore: number | null;
            stressLevel: import("@prisma/client").$Enums.StressLevel | null;
            connected: boolean;
            lastUpdate: Date | null;
            createdAt: Date;
            updatedAt: Date;
        }[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    findOne(id: number): Promise<{
        examStudents: ({
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
    } & {
        id: number;
        email: string;
        studentCode: string;
        braceletId: string | null;
        firstName: string;
        lastName: string;
        password: string;
        department: string;
        heartRate: number | null;
        stressScore: number | null;
        stressLevel: import("@prisma/client").$Enums.StressLevel | null;
        connected: boolean;
        lastUpdate: Date | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    update(id: number, updateStudentDto: UpdateStudentDto): Promise<{
        id: number;
        email: string;
        studentCode: string;
        braceletId: string | null;
        firstName: string;
        lastName: string;
        password: string;
        department: string;
        heartRate: number | null;
        stressScore: number | null;
        stressLevel: import("@prisma/client").$Enums.StressLevel | null;
        connected: boolean;
        lastUpdate: Date | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    remove(id: number): Promise<{
        id: number;
        email: string;
        studentCode: string;
        braceletId: string | null;
        firstName: string;
        lastName: string;
        password: string;
        department: string;
        heartRate: number | null;
        stressScore: number | null;
        stressLevel: import("@prisma/client").$Enums.StressLevel | null;
        connected: boolean;
        lastUpdate: Date | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
