import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import * as bcrypt from 'bcrypt';
import { MailService } from '../mail/mail.service';

@Injectable()
export class StudentsService {
  constructor(
    private prisma: PrismaService,
    private mailService: MailService,
  ) {}

  async create(createStudentDto: CreateStudentDto) {
    const emailExists = await this.prisma.user.findUnique({
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

    const studentRecord = await this.prisma.user.create({
      data: {
        firstName: createStudentDto.firstName,
        lastName: createStudentDto.lastName,
        email: createStudentDto.email,
        password: hashedPassword,
        role: 'STUDENT',
        student: {
          create: {
            studentCode: createStudentDto.studentCode,
            group: createStudentDto.group,
            braceletId: createStudentDto.braceletId,
          }
        }
      },
      include: {
        student: true,
      }
    });

    try {
      await this.mailService.sendStudentCredentials(
        createStudentDto.email,
        `${createStudentDto.firstName} ${createStudentDto.lastName}`,
        createStudentDto.password,
      );
    } catch (error) {
      console.error('Email sending failed:', error);
    }

    return studentRecord;
  }

  async findAll(paginationDto: PaginationDto) {
    const page = paginationDto.page ?? 1;
    const limit = paginationDto.limit ?? 100;
    const skip = (page - 1) * limit;

    const where: any = {};

    const search = paginationDto.search;
    if (search) {
      where.OR = [
        { user: { firstName: { contains: search } } },
        { user: { lastName: { contains: search } } },
        { user: { email: { contains: search } } },
        { studentCode: { contains: search } },
      ];
    }

    const [items, total] = await Promise.all([
      this.prisma.student.findMany({
        where,
        skip,
        take: limit,
        include: { user: true },
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

  async findOne(id: number) {
    const student = await this.prisma.student.findUnique({
      where: { id },
      include: {
        user: true,
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
    const student = await this.findOne(id);

    if (updateStudentDto.email) {
      const emailExists = await this.prisma.user.findFirst({
        where: { email: updateStudentDto.email, NOT: { id: student.userId } },
      });
      if (emailExists) {
        throw new ConflictException('Email already registered for another user');
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

    if (updateStudentDto.email || updateStudentDto.firstName || updateStudentDto.lastName) {
      await this.prisma.user.update({
        where: { id: student.userId },
        data: {
          email: updateStudentDto.email,
          firstName: updateStudentDto.firstName,
          lastName: updateStudentDto.lastName,
        }
      });
    }

    return this.prisma.student.update({
      where: { id },
      data: {
        studentCode: updateStudentDto.studentCode,
        group: updateStudentDto.group,
        braceletId: updateStudentDto.braceletId,
      },
      include: { user: true },
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.student.delete({
      where: { id },
    });
  }

  async pairDevice(id: number, deviceId: string, seatNumber?: string) {
    const student = await this.prisma.student.findUnique({
      where: { id },
    });

    if (!student) {
      throw new NotFoundException(`Student with ID ${id} not found`);
    }

    if (deviceId) {
      const existing = await this.prisma.student.findUnique({
        where: { braceletId: deviceId },
      });
      if (existing && existing.id !== id) {
        await this.prisma.student.update({
          where: { id: existing.id },
          data: { braceletId: null, connected: false },
        });
      }
    }

    return this.prisma.student.update({
      where: { id },
      data: {
        braceletId: deviceId,
        seatNumber: seatNumber,
        connected: true,
      },
    });
  }

  async unpairDevice(id: number) {
    const student = await this.prisma.student.findUnique({
      where: { id },
    });

    if (!student) {
      throw new NotFoundException(`Student with ID ${id} not found`);
    }

    return this.prisma.student.update({
      where: { id },
      data: {
        braceletId: null,
        seatNumber: null,
        connected: false,
      },
    });
  }
}
