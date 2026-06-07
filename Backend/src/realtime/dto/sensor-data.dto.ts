import { IsNumber } from "class-validator";
import { SensorFrame } from "../interfaces/sensor-frame.interface";
export class SensorDataDto implements SensorFrame {
    @IsNumber()
    timestamp!: number;

    @IsNumber()
    hr!: number;

    @IsNumber()
    hrv!: number;

    @IsNumber()
    gsr!: number;
}