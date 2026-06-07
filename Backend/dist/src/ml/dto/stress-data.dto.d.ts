export declare class NormalizedDto {
    hr_norm: number;
}
export declare class StressDataDto {
    esp32_id: string;
    stress_level: string;
    confidence: number;
    normalized: NormalizedDto;
}
