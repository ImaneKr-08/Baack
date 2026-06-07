import { PrismaService } from '../prisma/prisma.service';
export declare class QrCodesService {
    private prisma;
    constructor(prisma: PrismaService);
    generateQrCodeForTable(tableId: number): Promise<string>;
    generateBatchForClassroom(classroomId: number): Promise<{
        classroomId: number;
        totalGenerated: number;
        tables: any[];
    }>;
    getQrCodeBuffer(tableId: number): Promise<{
        buffer: Buffer;
        filename: string;
    }>;
}
