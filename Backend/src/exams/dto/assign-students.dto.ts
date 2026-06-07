import { ApiProperty } from '@nestjs/swagger';
import { IsArray, ValidateNested, IsInt } from 'class-validator';
import { Type } from 'class-transformer';

export class StudentAssignmentDto {
  @ApiProperty()
  @IsInt()
  studentId!: number;

  @ApiProperty()
  @IsInt()
  tableId!: number;
}

export class AssignStudentsDto {
  @ApiProperty({ type: [StudentAssignmentDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => StudentAssignmentDto)
  assignments!: StudentAssignmentDto[];
}
