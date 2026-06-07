import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, Min } from 'class-validator';

export class CreateTableDto {
  @ApiProperty()
  @IsInt()
  classroomId!: number;

  @ApiProperty()
  @IsInt()
  @Min(0)
  positionX!: number;

  @ApiProperty()
  @IsInt()
  @Min(0)
  positionY!: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  qrCode?: string;
}
