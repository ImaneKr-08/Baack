import { PrismaService } from '../prisma/prisma.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
export declare class StudentsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createStudentDto: CreateStudentDto): Promise<{
        firstName: string;
        lastName: string;
        email: string;
        password: string;
        department: string;
        studentCode: string;
        braceletId: string | null;
        heartRate: number | null;
        stressScore: number | null;
        stressLevel: import("@prisma/client").$Enums.StressLevel | null;
        connected: boolean;
        lastUpdate: Date | null;
        createdAt: Date;
        updatedAt: Date;
        id: number;
    }>;
    findAll(paginationDto: PaginationDto, department?: string): Promise<{
        items: {
            firstName: string;
            lastName: string;
            email: string;
            password: string;
            department: string;
            studentCode: string;
            braceletId: string | null;
            heartRate: number | null;
            stressScore: number | null;
            stressLevel: import("@prisma/client").$Enums.StressLevel | null;
            connected: boolean;
            lastUpdate: Date | null;
            createdAt: Date;
            updatedAt: Date;
            id: number;
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
        firstName: string;
        lastName: string;
        email: string;
        password: string;
        department: string;
        studentCode: string;
        braceletId: string | null;
        heartRate: number | null;
        stressScore: number | null;
        stressLevel: import("@prisma/client").$Enums.StressLevel | null;
        connected: boolean;
        lastUpdate: Date | null;
        createdAt: Date;
        updatedAt: Date;
        id: number;
    }>;
    update(id: number, updateStudentDto: UpdateStudentDto): Promise<{
        firstName: string;
        lastName: string;
        email: string;
        password: string;
        department: string;
        studentCode: string;
        braceletId: string | null;
        heartRate: number | null;
        stressScore: number | null;
        stressLevel: import("@prisma/client").$Enums.StressLevel | null;
        connected: boolean;
        lastUpdate: Date | null;
        createdAt: Date;
        updatedAt: Date;
        id: number;
    }>;
    remove(id: number): Promise<{
        firstName: string;
        lastName: string;
        email: string;
        password: string;
        department: string;
        studentCode: string;
        braceletId: string | null;
        heartRate: number | null;
        stressScore: number | null;
        stressLevel: import("@prisma/client").$Enums.StressLevel | null;
        connected: boolean;
        lastUpdate: Date | null;
        createdAt: Date;
        updatedAt: Date;
        id: number;
    }>;
}
