import { ApiProperty } from '@nestjs/swagger';
import { IsArray, ValidateNested, IsInt, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class StudentAssignmentDto {
  @ApiProperty()
  @IsInt()
  studentId!: number;

  @ApiProperty()
  @IsInt()
  tableId!: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  braceletId?: string;
}

export class AssignStudentsDto {
  @ApiProperty({ type: [StudentAssignmentDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => StudentAssignmentDto)
  assignments!: StudentAssignmentDto[];
}
