import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateStudentDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  firstName!: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  lastName!: string;

  @ApiProperty()
  @IsEmail()
  email!: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  department!: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  studentCode!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  braceletId?: string;
  
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  password!: string;
}
