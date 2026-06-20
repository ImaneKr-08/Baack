import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAppointmentDto {
    @ApiProperty()
    @IsInt()
    studentId!: number;
    
    @ApiProperty()
    @IsInt()
    therapistId!: number;
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    type!: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    notes?: string;

}