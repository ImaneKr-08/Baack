import { ClassroomsService } from './classrooms.service';
import { CreateClassroomDto } from './dto/create-classroom.dto';
import { UpdateClassroomDto } from './dto/update-classroom.dto';
export declare class ClassroomsController {
    private readonly classroomsService;
    constructor(classroomsService: ClassroomsService);
    create(createClassroomDto: CreateClassroomDto): Promise<{
        id: number;
        name: string;
        building: string;
        capacity: number;
        rows: number;
        columns: number;
    }>;
    findAll(): Promise<({
        _count: {
            tables: number;
        };
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
            classroomId: number;
            qrCode: string | null;
            positionX: number;
            positionY: number;
        }[];
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
    remove(id: number): Promise<{
        id: number;
        name: string;
        building: string;
        capacity: number;
        rows: number;
        columns: number;
    }>;
}
