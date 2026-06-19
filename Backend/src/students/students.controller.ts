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
  Logger,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { StudentsService } from './students.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/enums/roles.enum';

@ApiTags('students')
@Controller('students')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class StudentsController {
  private readonly logger = new Logger(StudentsController.name);

  constructor(private readonly studentsService: StudentsService) {}

  @Post()
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Create student (Admin only)' })
  @ApiResponse({ status: 201, description: 'Student successfully created' })
  create(@Body() createStudentDto: CreateStudentDto) {
    return this.studentsService.create(createStudentDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all students' })
  @ApiResponse({
    status: 200,
    description: 'Return paginated list of students',
  })
  findAll(@Query() paginationDto: PaginationDto) {
    return this.studentsService.findAll(paginationDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get student by ID' })
  @ApiResponse({ status: 200, description: 'Return student details' })
  @ApiResponse({ status: 404, description: 'Student not found' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.studentsService.findOne(id);
  }

  @Patch(':id')
  @Roles(Role.ADMIN, Role.PROFESSOR)
  @ApiOperation({ summary: 'Update student' })
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

  @Patch(':id/pair')
  @Roles(Role.ADMIN, Role.PROFESSOR, Role.STUDENT)
  @ApiOperation({ summary: 'Pair device to student' })
  @ApiResponse({ status: 200, description: 'Device successfully paired' })
  pairDevice(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { deviceId: string; seatNumber?: string; studentId?: string },
  ) {
    this.logger.debug(
      `Received student pair request for studentId=${id}, deviceId=${body.deviceId}, seatNumber=${body.seatNumber ?? 'none'}, studentCode=${body.studentId ?? 'none'}`,
    );
    return this.studentsService.pairDevice(id, body.deviceId, body.seatNumber);
  }

  @Patch(':id/unpair')
  @Roles(Role.ADMIN, Role.PROFESSOR, Role.STUDENT)
  @ApiOperation({ summary: 'Unpair device from student' })
  @ApiResponse({ status: 200, description: 'Device successfully unpaired' })
  unpairDevice(
    @Param('id', ParseIntPipe) id: number,
    @Body() body?: { studentId?: string },
  ) {
    this.logger.debug(
      `Received student unpair request for DB id=${id}, studentCode=${body?.studentId ?? 'none'}`,
    );
    return this.studentsService.unpairDevice(id);
  }
}
