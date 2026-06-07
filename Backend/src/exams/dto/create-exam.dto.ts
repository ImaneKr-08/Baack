import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsInt, IsNotEmpty, IsString } from 'class-validator';

export class CreateExamDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  title!: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  module!: string;

  @ApiProperty({ example: '2026-06-15T09:00:00Z' })
  @IsDateString()
  examDate!: string;

  @ApiProperty({ example: '2026-06-15T09:00:00Z' })
  @IsDateString()
  startTime!: string;

  @ApiProperty({ example: '2026-06-15T11:00:00Z' })
  @IsDateString()
  endTime!: string;

  @ApiProperty()
  @IsInt()
  classroomId!: number;

  @ApiProperty()
  @IsInt()
  professorId!: number;
}
