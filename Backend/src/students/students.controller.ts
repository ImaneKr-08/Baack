import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
  ParseIntPipe,
  Request,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { StudentsService } from './students.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/enums/roles.enum';
import { Public } from '../common/decorators/public.decorator';

@ApiTags('students')
@Controller('students')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  @Post()
  @Public()
  @ApiOperation({ summary: 'Register / Create student' })
  @ApiResponse({ status: 201, description: 'Student successfully created' })
  create(@Body() createStudentDto: CreateStudentDto) {
    return this.studentsService.create(createStudentDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all students' })
  @ApiQuery({ name: 'department', required: false, type: String })
  @ApiResponse({ status: 200, description: 'Return list of students' })
  async findAll(
    @Query() paginationDto: PaginationDto,
    @Query('department') department?: string,
  ) {
    const result = await this.studentsService.findAll(paginationDto, department);
    if (paginationDto.page === undefined && paginationDto.limit === undefined) {
      return result.items;
    }
    return result;
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get student by ID' })
  @ApiResponse({ status: 200, description: 'Return student details' })
  @ApiResponse({ status: 404, description: 'Student not found' })
  findOne(@Param('id', ParseIntPipe) id: number, @Request() req: any) {
    return this.studentsService.findOne(id, req.user);
  }

  @Patch(':id')
  @Roles(Role.ADMIN, Role.PROFESSOR)
  @ApiOperation({ summary: 'Update student (Admin/Professor only)' })
  @ApiResponse({ status: 200, description: 'Student successfully updated' })
  @ApiResponse({ status: 404, description: 'Student not found' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateStudentDto: UpdateStudentDto,
  ) {
    return this.studentsService.update(id, updateStudentDto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Delete student (Admin only)' })
  @ApiResponse({ status: 200, description: 'Student successfully deleted' })
  @ApiResponse({ status: 404, description: 'Student not found' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.studentsService.remove(id);
  }

  @Patch(':id/profile')
  @ApiOperation({ summary: 'Update student profile details' })
  updateProfile(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { name?: string; email?: string; password?: string },
    @Request() req: any,
  ) {
    return this.studentsService.updateProfile(id, body, req.user);
  }

  @Patch(':id/pair')
  @ApiOperation({ summary: 'Pair student with ESP32 device' })
  pair(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { deviceId: string; seatNumber?: string },
    @Request() req: any,
  ) {
    return this.studentsService.pair(id, body.deviceId, body.seatNumber, req.user);
  }

  @Patch(':id/unpair')
  @ApiOperation({ summary: 'Unpair student from ESP32 device' })
  unpair(@Param('id', ParseIntPipe) id: number, @Request() req: any) {
    return this.studentsService.unpair(id, req.user);
  }

  @Get(':id/journal')
  @ApiOperation({ summary: 'Get student journal entries' })
  getJournal(@Param('id', ParseIntPipe) id: number, @Request() req: any) {
    return this.studentsService.getJournal(id, req.user);
  }

  @Post(':id/journal')
  @ApiOperation({ summary: 'Create a new journal entry' })
  createJournal(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { moodRating: number; sleepHours: number; studyHours: number; notes: string; date?: string },
    @Request() req: any,
  ) {
    return this.studentsService.createJournal(id, body, req.user);
  }

  @Get(':id/therapists')
  @ApiOperation({ summary: 'Get booked therapist sessions' })
  getTherapistSessions(@Param('id', ParseIntPipe) id: number, @Request() req: any) {
    return this.studentsService.getTherapistSessions(id, req.user);
  }

  @Post(':id/therapists')
  @ApiOperation({ summary: 'Book a therapist session' })
  bookTherapistSession(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { therapistName: string; type: string; dateTime: string; status?: string },
    @Request() req: any,
  ) {
    return this.studentsService.bookTherapistSession(id, body, req.user);
  }

  @Get(':id/upcoming-exams')
  @ApiOperation({ summary: 'Get scheduled upcoming exams' })
  getUpcomingExams(@Param('id', ParseIntPipe) id: number, @Request() req: any) {
    return this.studentsService.getUpcomingExams(id, req.user);
  }

  @Post(':id/upcoming-exams')
  @ApiOperation({ summary: 'Schedule an upcoming exam' })
  scheduleUpcomingExam(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { courseName: string; dateTime: string; professorName?: string; durationMinutes?: number },
    @Request() req: any,
  ) {
    return this.studentsService.scheduleUpcomingExam(id, body, req.user);
  }

  @Delete(':id/upcoming-exams/:examId')
  @ApiOperation({ summary: 'Remove an upcoming exam' })
  removeUpcomingExam(
    @Param('id', ParseIntPipe) id: number,
    @Param('examId') examId: string,
    @Request() req: any,
  ) {
    return this.studentsService.removeUpcomingExam(id, examId, req.user);
  }

  @Patch(':id/upcoming-exams/:examId')
  @ApiOperation({ summary: 'Update upcoming exam advice' })
  updateUpcomingExamAdvice(
    @Param('id', ParseIntPipe) id: number,
    @Param('examId') examId: string,
    @Body() body: { aiAdvice: string },
    @Request() req: any,
  ) {
    return this.studentsService.updateUpcomingExamAdvice(id, examId, body.aiAdvice, req.user);
  }

  @Get(':id/exam-history')
  @ApiOperation({ summary: 'Get exam history' })
  getExamHistory(@Param('id', ParseIntPipe) id: number, @Request() req: any) {
    return this.studentsService.getExamHistory(id, req.user);
  }

  @Post(':id/exam-history')
  @ApiOperation({ summary: 'Add an exam session to history' })
  createExamHistory(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { courseName: string; dateTime: string; durationMinutes: number; avgStressScore: number; maxHeartRate: number; tableNumber: string },
    @Request() req: any,
  ) {
    return this.studentsService.createExamHistory(id, body, req.user);
  }
}
