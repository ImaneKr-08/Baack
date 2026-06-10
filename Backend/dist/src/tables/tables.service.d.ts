import { PrismaService } from '../prisma/prisma.service';
import { CreateTableDto } from './dto/create-table.dto';
import { UpdateTableDto } from './dto/update-table.dto';
export declare class TablesService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createTableDto: CreateTableDto): Promise<{
        id: number;
        positionX: number;
        positionY: number;
        classroomId: number;
        qrCode: string | null;
    }>;
    findAll(classroomId?: number): Promise<({
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
        positionX: number;
        positionY: number;
        classroomId: number;
        qrCode: string | null;
    })[]>;
    findOne(id: number): Promise<{
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
        positionX: number;
        positionY: number;
        classroomId: number;
        qrCode: string | null;
    }>;
    update(id: number, updateTableDto: UpdateTableDto): Promise<{
        id: number;
        positionX: number;
        positionY: number;
        classroomId: number;
        qrCode: string | null;
    }>;
    remove(id: number): Promise<{
        id: number;
        positionX: number;
        positionY: number;
        classroomId: number;
        qrCode: string | null;
    }>;
}
