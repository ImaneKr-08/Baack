import { QrCodesService } from './qr-codes.service';
export declare class QrCodesController {
    private readonly qrCodesService;
    constructor(qrCodesService: QrCodesService);
    generate(tableId: number): Promise<{
        tableId: number;
        qrCode: string;
    }>;
    generateBatch(classroomId: number): Promise<{
        classroomId: number;
        totalGenerated: number;
        tables: any[];
    }>;
    download(tableId: number, res: any): Promise<void>;
}
