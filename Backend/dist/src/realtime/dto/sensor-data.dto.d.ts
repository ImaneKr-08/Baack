import { SensorFrame } from "../interfaces/sensor-frame.interface";
export declare class SensorDataDto implements SensorFrame {
    timestamp: number;
    hr: number;
    hrv: number;
    gsr: number;
}
