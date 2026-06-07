import { ProfessorsService } from './professors.service';
import { CreateProfessorDto } from './dto/create-professor.dto';
import { UpdateProfessorDto } from './dto/update-professor.dto';
export declare class ProfessorsController {
    private readonly professorsService;
    constructor(professorsService: ProfessorsService);
    create(createProfessorDto: CreateProfessorDto): Promise<{
        user: {
            id: number;
            role: import("@prisma/client").$Enums.Role;
            createdAt: Date;
        };
    } & {
        id: number;
        email: string;
        userId: number;
        firstName: string;
        lastName: string;
        department: string;
    }>;
    findAll(): Promise<({
        user: {
            id: number;
            role: import("@prisma/client").$Enums.Role;
            createdAt: Date;
        };
    } & {
        id: number;
        email: string;
        userId: number;
        firstName: string;
        lastName: string;
        department: string;
    })[]>;
    findOne(id: number): Promise<{
        user: {
            id: number;
            role: import("@prisma/client").$Enums.Role;
            createdAt: Date;
        };
        exams: {
            id: number;
            title: string;
            module: string;
            examDate: Date;
            startTime: Date;
            endTime: Date;
            classroomId: number;
            professorId: number;
            status: import("@prisma/client").$Enums.ExamStatus;
        }[];
    } & {
        id: number;
        email: string;
        userId: number;
        firstName: string;
        lastName: string;
        department: string;
    }>;
    update(id: number, updateProfessorDto: UpdateProfessorDto): Promise<{
        user: {
            id: number;
            role: import("@prisma/client").$Enums.Role;
        };
    } & {
        id: number;
        email: string;
        userId: number;
        firstName: string;
        lastName: string;
        department: string;
    }>;
    remove(id: number): Promise<{
        id: number;
        email: string;
        name: string;
        password: string;
        role: import("@prisma/client").$Enums.Role;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
