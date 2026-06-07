import { SensorFrame } from "../interfaces/sensor-frame.interface";
export declare class BufferService {
    private buffer;
    addFrame(userId: string, frame: SensorFrame): void;
    getBuffer(userId: string): SensorFrame[];
    clearBuffer(userId: string): void;
}
