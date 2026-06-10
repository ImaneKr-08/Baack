import { PrismaService } from '../prisma/prisma.service';
import { CreateClassroomDto } from './dto/create-classroom.dto';
import { UpdateClassroomDto } from './dto/update-classroom.dto';
export declare class ClassroomsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createClassroomDto: CreateClassroomDto): Promise<{
        id: number;
        name: string;
        building: string;
        capacity: number;
        rows: number;
        columns: number;
    }>;
    findAll(): Promise<({
        tables: {
            id: number;
            positionX: number;
            positionY: number;
            classroomId: number;
            qrCode: string | null;
        }[];
    } & {
        id: number;
        name: string;
        building: string;
        capacity: number;
        rows: number;
        columns: number;
    })[]>;
    findOne(id: number): Promise<{
        tables: {
            id: number;
            positionX: number;
            positionY: number;
            classroomId: number;
            qrCode: string | null;
        }[];
        exams: {
            id: number;
            title: string;
            classroomId: number;
            module: string;
            examDate: Date;
            startTime: Date;
            endTime: Date;
            professorId: number;
            status: import("@prisma/client").$Enums.ExamStatus;
        }[];
    } & {
        id: number;
        name: string;
        building: string;
        capacity: number;
        rows: number;
        columns: number;
    }>;
    update(id: number, updateClassroomDto: UpdateClassroomDto): Promise<{
        id: number;
        name: string;
        building: string;
        capacity: number;
        rows: number;
        columns: number;
    }>;
    updateLayout(classroomId: number, tables: {
        id: number;
        positionX: number;
        positionY: number;
    }[]): Promise<import("@prisma/client").Prisma.BatchPayload[]>;
    remove(id: number): Promise<{
        id: number;
        name: string;
        building: string;
        capacity: number;
        rows: number;
        columns: number;
    }>;
}
