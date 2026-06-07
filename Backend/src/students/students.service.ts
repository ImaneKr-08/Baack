import { Injectable, NotFoundException, ConflictException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import * as bcrypt from 'bcrypt';
@Injectable()
export class StudentsService {
  constructor(private prisma: PrismaService) {}

  private validateRequester(id: number, requester?: any) {
    if (requester && requester.role === 'STUDENT' && requester.id !== id) {
      throw new UnauthorizedException('Access denied: You can only access your own data');
    }
  }

  async create(createStudentDto: CreateStudentDto) {
    const emailExists = await this.prisma.student.findUnique({
      where: { email: createStudentDto.email },
    });

    if (emailExists) {
      throw new ConflictException(
        'Email already registered for a student',
      );
    }

    const codeExists = await this.prisma.student.findUnique({
      where: { studentCode: createStudentDto.studentCode },
    });

    if (codeExists) {
      throw new ConflictException(
        'Student code already registered',
      );
    }

    if (createStudentDto.braceletId) {
      const braceletExists = await this.prisma.student.findUnique({
        where: { braceletId: createStudentDto.braceletId },
      });

      if (braceletExists) {
        throw new ConflictException(
          'Bracelet already assigned to another student',
        );
      }
    }

    const hashedPassword = await bcrypt.hash(
      createStudentDto.password,
      10,
    );

    const department = createStudentDto.department || 'General';

    return this.prisma.student.create({
      data: {
        ...createStudentDto,
        department,
        password: hashedPassword,
      },
    });
  }

  async findAll(paginationDto: PaginationDto, department?: string) {
    const page = paginationDto.page ?? 1;
    const limit = paginationDto.limit ?? 100;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (department) {
      where.department = department;
    }

    const search = paginationDto.search;
    if (search) {
      where.OR = [
        { firstName: { contains: search } },
        { lastName: { contains: search } },
        { email: { contains: search } },
        { studentCode: { contains: search } },
      ];
    }

    const [items, total] = await Promise.all([
      this.prisma.student.findMany({
        where,
        skip,
        take: limit,
        orderBy: { lastName: 'asc' },
      }),
      this.prisma.student.count({ where }),
    ]);

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: number, requester?: any) {
    this.validateRequester(id, requester);
    const student = await this.prisma.student.findUnique({
      where: { id },
      include: {
        examStudents: {
          include: {
            exam: true,
            table: true,
          },
        },
      },
    });

    if (!student) {
      throw new NotFoundException(`Student with ID ${id} not found`);
    }

    return student;
  }

  async update(id: number, updateStudentDto: UpdateStudentDto) {
    await this.findOne(id);

    if (updateStudentDto.email) {
      const emailExists = await this.prisma.student.findFirst({
        where: { email: updateStudentDto.email, NOT: { id } },
      });
      if (emailExists) {
        throw new ConflictException('Email already registered for another student');
      }
    }

    if (updateStudentDto.studentCode) {
      const codeExists = await this.prisma.student.findFirst({
        where: { studentCode: updateStudentDto.studentCode, NOT: { id } },
      });
      if (codeExists) {
        throw new ConflictException('Student code already registered for another student');
      }
    }

    if (updateStudentDto.braceletId) {
      const braceletExists = await this.prisma.student.findFirst({
        where: { braceletId: updateStudentDto.braceletId, NOT: { id } },
      });
      if (braceletExists) {
        throw new ConflictException('Bracelet already assigned to another student');
      }
    }

    return this.prisma.student.update({
      where: { id },
      data: updateStudentDto,
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.student.delete({
      where: { id },
    });
  }

  async updateProfile(id: number, body: { name?: string; email?: string; password?: string }, requester?: any) {
    this.validateRequester(id, requester);
    await this.findOne(id);

    const data: any = {};
    if (body.name) {
      const parts = body.name.trim().split(' ');
      data.firstName = parts[0];
      data.lastName = parts.slice(1).join(' ') || 'Student';
    }
    if (body.email) {
      const emailExists = await this.prisma.student.findFirst({
        where: { email: body.email, NOT: { id } },
      });
      if (emailExists) {
        throw new ConflictException('Email already registered for another student');
      }
      data.email = body.email;
    }
    if (body.password) {
      data.password = await bcrypt.hash(body.password, 10);
    }

    return this.prisma.student.update({
      where: { id },
      data,
    });
  }

  async pair(id: number, deviceId: string, seatNumber?: string, requester?: any) {
    this.validateRequester(id, requester);
    await this.findOne(id);

    if (deviceId) {
      const braceletExists = await this.prisma.student.findFirst({
        where: { braceletId: deviceId, NOT: { id } },
      });
      if (braceletExists) {
        throw new ConflictException('Bracelet already assigned to another student');
      }
    }

    return this.prisma.student.update({
      where: { id },
      data: {
        braceletId: deviceId,
        connected: true,
        seatNumber: seatNumber || null,
        lastUpdate: new Date(),
      },
    });
  }

  async unpair(id: number, requester?: any) {
    this.validateRequester(id, requester);
    await this.findOne(id);

    return this.prisma.student.update({
      where: { id },
      data: {
        braceletId: null,
        connected: false,
        seatNumber: null,
        lastUpdate: new Date(),
      },
    });
  }

  async getJournal(id: number, requester?: any) {
    this.validateRequester(id, requester);
    return this.prisma.journalEntry.findMany({
      where: { studentId: id },
      orderBy: { date: 'desc' },
    });
  }

  async createJournal(
    id: number,
    body: { moodRating: number; sleepHours: number; studyHours: number; notes: string; date?: string },
    requester?: any,
  ) {
    this.validateRequester(id, requester);
    return this.prisma.journalEntry.create({
      data: {
        studentId: id,
        moodRating: body.moodRating,
        sleepHours: body.sleepHours,
        studyHours: body.studyHours,
        notes: body.notes,
        date: body.date ? new Date(body.date) : new Date(),
      },
    });
  }

  async getTherapistSessions(id: number, requester?: any) {
    this.validateRequester(id, requester);
    return this.prisma.therapistSession.findMany({
      where: { studentId: id },
      orderBy: { dateTime: 'asc' },
    });
  }

  async bookTherapistSession(
    id: number,
    body: { therapistName: string; type: string; dateTime: string; status?: string },
    requester?: any,
  ) {
    this.validateRequester(id, requester);
    return this.prisma.therapistSession.create({
      data: {
        studentId: id,
        therapistName: body.therapistName,
        type: body.type,
        dateTime: new Date(body.dateTime),
        status: body.status || 'Scheduled',
      },
    });
  }

  async getUpcomingExams(id: number, requester?: any) {
    this.validateRequester(id, requester);
    return this.prisma.upcomingExam.findMany({
      where: { studentId: id },
      orderBy: { dateTime: 'asc' },
    });
  }

  async scheduleUpcomingExam(
    id: number,
    body: { courseName: string; dateTime: string; professorName?: string; durationMinutes?: number },
    requester?: any,
  ) {
    this.validateRequester(id, requester);
    return this.prisma.upcomingExam.create({
      data: {
        studentId: id,
        courseName: body.courseName,
        dateTime: new Date(body.dateTime),
        professorName: body.professorName || null,
        durationMinutes: body.durationMinutes || 90,
      },
    });
  }

  async removeUpcomingExam(id: number, examId: string, requester?: any) {
    this.validateRequester(id, requester);
    return this.prisma.upcomingExam.deleteMany({
      where: {
        id: examId,
        studentId: id,
      },
    });
  }

  async updateUpcomingExamAdvice(id: number, examId: string, aiAdvice: string, requester?: any) {
    this.validateRequester(id, requester);
    return this.prisma.upcomingExam.update({
      where: {
        id: examId,
      },
      data: {
        aiAdvice,
      },
    });
  }

  async getExamHistory(id: number, requester?: any) {
    this.validateRequester(id, requester);
    return this.prisma.examSession.findMany({
      where: { studentId: id },
      orderBy: { dateTime: 'desc' },
    });
  }

  async createExamHistory(
    id: number,
    body: { courseName: string; dateTime: string; durationMinutes: number; avgStressScore: number; maxHeartRate: number; tableNumber: string },
    requester?: any,
  ) {
    this.validateRequester(id, requester);
    return this.prisma.examSession.create({
      data: {
        studentId: id,
        courseName: body.courseName,
        dateTime: new Date(body.dateTime),
        durationMinutes: body.durationMinutes,
        avgStressScore: body.avgStressScore,
        maxHeartRate: body.maxHeartRate,
        tableNumber: body.tableNumber,
      },
    });
  }
}
