import { PrismaService } from '../prisma/prisma.service';
import { RealtimeGateway } from '../realtime/gateways/realtime.gateways';
import { StressDataDto } from './dto/stress-data.dto';
export declare class MlService {
    private prisma;
    private realtimeGateway;
    constructor(prisma: PrismaService, realtimeGateway: RealtimeGateway);
    processStressData(dto: StressDataDto): Promise<{
        success: boolean;
        message: string;
        data: {
            studentId: number;
            heartRate: number;
            stressLevel: string;
            inActiveSession: boolean;
        };
    }>;
}
