import { MlService } from './ml.service';
import { StressDataDto } from './dto/stress-data.dto';
export declare class MlController {
    private readonly mlService;
    constructor(mlService: MlService);
    receiveStressData(stressDataDto: StressDataDto): Promise<{
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
