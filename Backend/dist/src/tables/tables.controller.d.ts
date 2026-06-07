import { TablesService } from './tables.service';
import { CreateTableDto } from './dto/create-table.dto';
import { UpdateTableDto } from './dto/update-table.dto';
export declare class TablesController {
    private readonly tablesService;
    constructor(tablesService: TablesService);
    create(createTableDto: CreateTableDto): Promise<{
        id: number;
        classroomId: number;
        qrCode: string | null;
        positionX: number;
        positionY: number;
    }>;
    findAll(classroomId?: string): Promise<({
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
