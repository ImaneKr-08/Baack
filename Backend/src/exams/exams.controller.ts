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
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ExamsService } from './exams.service';
import { CreateExamDto } from './dto/create-exam.dto';
import { UpdateExamDto } from './dto/update-exam.dto';
import { AssignProfessorDto } from './dto/assign-professor.dto';
import { AssignStudentsDto } from './dto/assign-students.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/enums/roles.enum';

@ApiTags('exams')
@Controller('exams')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class ExamsController {
  constructor(private readonly examsService: ExamsService) {}

  @Post()
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Create a new exam (Admin only)' })
  @ApiResponse({ status: 201, description: 'Exam successfully created' })
  create(@Body() createExamDto: CreateExamDto) {
    return this.examsService.create(createExamDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all exams' })
  @ApiResponse({ status: 200, description: 'Return list of exams' })
  findAll() {
    return this.examsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get exam details by ID' })
  @ApiResponse({ status: 200, description: 'Return exam details with classroom, professor, and student seating' })
  @ApiResponse({ status: 404, description: 'Exam not found' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.examsService.findOne(id);
  }

  @Patch(':id')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Update exam details (Admin only)' })
  @ApiResponse({ status: 200, description: 'Exam successfully updated' })
  @ApiResponse({ status: 404, description: 'Exam not found' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateExamDto: UpdateExamDto,
  ) {
    return this.examsService.update(id, updateExamDto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Delete exam (Admin only)' })
  @ApiResponse({ status: 200, description: 'Exam successfully deleted' })
  @ApiResponse({ status: 404, description: 'Exam not found' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.examsService.remove(id);
  }

  @Post(':id/assign-professor')
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Assign a professor to supervise an exam (Admin only)' })
  @ApiResponse({ status: 200, description: 'Professor successfully assigned' })
  assignProfessor(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: AssignProfessorDto,
  ) {
    return this.examsService.assignProfessor(id, dto.professorId);
  }

  @Post(':id/assign-students')
  @Roles(Role.ADMIN, Role.PROFESSOR)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Assign students to specific desks in the exam classroom' })
  @ApiResponse({ status: 200, description: 'Students successfully assigned' })
  assignStudents(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: AssignStudentsDto,
  ) {
    return this.examsService.assignStudents(id, dto.assignments);
  }

  @Post(':id/start')
  @Roles(Role.ADMIN, Role.PROFESSOR)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Start an exam: transitions status to ONGOING and opens monitoring' })
  @ApiResponse({ status: 200, description: 'Exam session successfully started' })
  start(@Param('id', ParseIntPipe) id: number) {
    return this.examsService.start(id);
  }

  @Post(':id/end')
  @Roles(Role.ADMIN, Role.PROFESSOR)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'End an exam: transitions status to COMPLETED and closes monitoring' })
  @ApiResponse({ status: 200, description: 'Exam session successfully ended' })
  end(@Param('id', ParseIntPipe) id: number) {
    return this.examsService.end(id);
  }
}
