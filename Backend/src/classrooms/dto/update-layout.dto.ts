// classrooms/dto/update-layout.dto.ts

import {
    IsArray,
    IsInt,
    Min,
    ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class TablePositionDto {
    @IsInt()
    id!: number;

    @IsInt()
    @Min(0)
    positionX!: number;

    @IsInt()
    @Min(0)
    positionY!: number;
}

export class UpdateLayoutDto {
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => TablePositionDto)
    tables!: TablePositionDto[];
}