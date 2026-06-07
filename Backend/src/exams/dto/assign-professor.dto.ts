import { ApiProperty } from '@nestjs/swagger';
import { IsInt } from 'class-validator';

export class AssignProfessorDto {
  @ApiProperty()
  @IsInt()
  professorId!: number;
}
