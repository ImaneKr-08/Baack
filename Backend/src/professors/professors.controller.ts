import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ProfessorsService } from './professors.service';
import { CreateProfessorDto } from './dto/create-professor.dto';
import { UpdateProfessorDto } from './dto/update-professor.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/enums/roles.enum';

@ApiTags('professors')
@Controller('professors')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class ProfessorsController {
  constructor(private readonly professorsService: ProfessorsService) {}

  @Post()
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Create professor and linked login account (Admin only)' })
  @ApiResponse({ status: 201, description: 'Professor successfully created' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  create(@Body() createProfessorDto: CreateProfessorDto) {
    return this.professorsService.create(createProfessorDto);
  }

  @Get()
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Get all professors (Admin only)' })
  @ApiResponse({ status: 200, description: 'Return list of professors' })
  findAll() {
    return this.professorsService.findAll();
  }

  @Get(':id')
  @Roles(Role.ADMIN, Role.PROFESSOR)
  @ApiOperation({ summary: 'Get professor details' })
  @ApiResponse({ status: 200, description: 'Return professor data' })
  @ApiResponse({ status: 404, description: 'Professor not found' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.professorsService.findOne(id);
  }

  @Patch(':id')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Update professor details (Admin only)' })
  @ApiResponse({ status: 200, description: 'Professor successfully updated' })
  @ApiResponse({ status: 404, description: 'Professor not found' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProfessorDto: UpdateProfessorDto,
  ) {
    return this.professorsService.update(id, updateProfessorDto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Delete professor and linked user account (Admin only)' })
  @ApiResponse({ status: 200, description: 'Professor successfully deleted' })
  @ApiResponse({ status: 404, description: 'Professor not found' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.professorsService.remove(id);
  }
}
