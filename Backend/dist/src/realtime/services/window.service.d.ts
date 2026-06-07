import { SensorFrame } from '../interfaces/sensor-frame.interface';
export declare class WindowService {
    private readonly WINDOW_SIZE;
    private readonly STEP_SIZE;
    private predictionCounters;
    createWindow(userId: string, buffer: SensorFrame[]): SensorFrame[] | null;
}
