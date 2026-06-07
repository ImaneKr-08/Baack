import { PrismaService } from '../prisma/prisma.service';
import { CreateTableDto } from './dto/create-table.dto';
import { UpdateTableDto } from './dto/update-table.dto';
export declare class TablesService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createTableDto: CreateTableDto): Promise<{
        id: number;
        classroomId: number;
        qrCode: string | null;
        positionX: number;
        positionY: number;
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
        classroomId: number;
        qrCode: string | null;
        positionX: number;
        positionY: number;
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
        classroomId: number;
        qrCode: string | null;
        positionX: number;
        positionY: number;
    }>;
    update(id: number, updateTableDto: UpdateTableDto): Promise<{
        id: number;
        classroomId: number;
        qrCode: string | null;
        positionX: number;
        positionY: number;
    }>;
    remove(id: number): Promise<{
        id: number;
        classroomId: number;
        qrCode: string | null;
        positionX: number;
        positionY: number;
    }>;
}
