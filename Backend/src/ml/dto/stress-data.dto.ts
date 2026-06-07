import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class NormalizedDto {
  @ApiProperty()
  @IsNumber()
  hr_norm!: number;
}

export class StressDataDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  esp32_id!: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  stress_level!: string;

  @ApiProperty()
  @IsNumber()
  confidence!: number;

  @ApiProperty()
  @ValidateNested()
  @Type(() => NormalizedDto)
  normalized!: NormalizedDto;
}
