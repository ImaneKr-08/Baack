import {
  Injectable,
  NotFoundException,
  ConflictException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import * as bcrypt from 'bcrypt';
import { MailService } from '../mail/mail.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class StudentsService {
  private readonly logger = new Logger(StudentsService.name);

  constructor(
    private prisma: PrismaService,
    private mailService: MailService,
  ) {}

  async create(createStudentDto: CreateStudentDto) {
    this.logger.debug(
      `Creating student studentCode=${createStudentDto.studentCode}, braceletId=${createStudentDto.braceletId ?? 'none'}`,
    );

    const emailExists = await this.prisma.user.findUnique({
      where: { email: createStudentDto.email },
    });

    if (emailExists) {
      this.logger.warn(
        `Create student blocked: email already registered for studentCode=${createStudentDto.studentCode}`,
      );
      throw new ConflictException('Email already registered for a student');
    }

    const codeExists = await this.prisma.student.findUnique({
      where: { studentCode: createStudentDto.studentCode },
    });

    if (codeExists) {
      this.logger.warn(
        `Create student blocked: studentCode already registered (${createStudentDto.studentCode})`,
      );
      throw new ConflictException('Student code already registered');
    }

    if (createStudentDto.braceletId) {
      const braceletExists = await this.prisma.student.findUnique({
        where: { braceletId: createStudentDto.braceletId },
      });

      if (braceletExists) {
        this.logger.warn(
          `Create student blocked: braceletId=${createStudentDto.braceletId} already assigned to studentId=${braceletExists.id}`,
        );
        throw new ConflictException(
          'Bracelet already assigned to another student',
        );
      }
    }

    const hashedPassword = await bcrypt.hash(createStudentDto.password, 10);

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
          },
        },
      },
      include: {
        student: true,
      },
    });

    this.logger.debug(
      `Created student userId=${studentRecord.id}, studentId=${studentRecord.student?.id}, braceletId=${studentRecord.student?.braceletId ?? 'none'}`,
    );

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

    const where: Prisma.StudentWhereInput = {};

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
    this.logger.debug(
      `Updating studentId=${id}, incomingBraceletId=${updateStudentDto.braceletId ?? 'unchanged'}`,
    );

    const student = await this.findOne(id);

    if (updateStudentDto.email) {
      const emailExists = await this.prisma.user.findFirst({
        where: { email: updateStudentDto.email, NOT: { id: student.userId } },
      });
      if (emailExists) {
        throw new ConflictException(
          'Email already registered for another user',
        );
      }
    }

    if (updateStudentDto.studentCode) {
      const codeExists = await this.prisma.student.findFirst({
        where: { studentCode: updateStudentDto.studentCode, NOT: { id } },
      });
      if (codeExists) {
        this.logger.warn(
          `Update student blocked: studentCode=${updateStudentDto.studentCode} already belongs to studentId=${codeExists.id}`,
        );
        throw new ConflictException(
          'Student code already registered for another student',
        );
      }
    }

    if (updateStudentDto.braceletId) {
      const braceletExists = await this.prisma.student.findFirst({
        where: { braceletId: updateStudentDto.braceletId, NOT: { id } },
      });
      if (braceletExists) {
        this.logger.warn(
          `Update student blocked: braceletId=${updateStudentDto.braceletId} already belongs to studentId=${braceletExists.id}`,
        );
        throw new ConflictException(
          'Bracelet already assigned to another student',
        );
      }
    }

    if (
      updateStudentDto.email ||
      updateStudentDto.firstName ||
      updateStudentDto.lastName
    ) {
      await this.prisma.user.update({
        where: { id: student.userId },
        data: {
          email: updateStudentDto.email,
          firstName: updateStudentDto.firstName,
          lastName: updateStudentDto.lastName,
        },
      });
    }

    const updated = await this.prisma.student.update({
      where: { id },
      data: {
        studentCode: updateStudentDto.studentCode,
        group: updateStudentDto.group,
        braceletId: updateStudentDto.braceletId,
      },
      include: { user: true },
    });

    this.logger.debug(
      `Updated studentId=${id}, braceletId=${updated.braceletId ?? 'none'}, connected=${updated.connected}`,
    );

    return updated;
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.student.delete({
      where: { id },
    });
  }

  async pairDevice(id: number, deviceId: string, seatNumber?: string) {
    this.logger.debug(
      `Pair-device started from Students API: studentId=${id}, deviceId=${deviceId}, seatNumber=${seatNumber ?? 'none'}`,
    );

    const student = await this.prisma.student.findUnique({
      where: { id },
    });

    if (!student) {
      this.logger.warn(
        `Pair-device failed: studentId=${id} not found for deviceId=${deviceId}`,
      );
      throw new NotFoundException(`Student with ID ${id} not found`);
    }

    this.logger.debug(
      `Pair-device target current state: studentId=${id}, oldBraceletId=${student.braceletId ?? 'none'}, connected=${student.connected}`,
    );

    if (deviceId) {
      const existing = await this.prisma.student.findUnique({
        where: { braceletId: deviceId },
      });
      this.logger.debug(
        `Existing bracelet assignment lookup for deviceId=${deviceId}: ${existing ? `studentId=${existing.id}` : 'none found'}`,
      );
      if (existing && existing.id !== id) {
        this.logger.warn(
          `DeviceId=${deviceId} is assigned to studentId=${existing.id}; unpairing before assigning to studentId=${id}`,
        );
        await this.prisma.student.update({
          where: { id: existing.id },
          data: { braceletId: null, connected: false },
        });
        this.logger.debug(
          `Disconnected previous studentId=${existing.id} from deviceId=${deviceId}`,
        );
      }
    }

    const updated = await this.prisma.student.update({
      where: { id },
      data: {
        braceletId: deviceId,
        seatNumber: seatNumber,
        connected: true,
      },
    });

    this.logger.debug(
      `Pair-device completed: studentId=${id}, braceletId=${updated.braceletId ?? 'none'}, seatNumber=${updated.seatNumber ?? 'none'}, connected=${updated.connected}`,
    );

    return updated;
  }

  async unpairDevice(id: number) {
    this.logger.debug(`Unpair-device started for studentId=${id}`);

    const student = await this.prisma.student.findUnique({
      where: { id },
    });

    if (!student) {
      this.logger.warn(`Unpair-device failed: studentId=${id} not found`);
      throw new NotFoundException(`Student with ID ${id} not found`);
    }

    this.logger.debug(
      `Unpair-device target current state: studentId=${id}, braceletId=${student.braceletId ?? 'none'}, connected=${student.connected}`,
    );

    const updated = await this.prisma.student.update({
      where: { id },
      data: {
        braceletId: null,
        seatNumber: null,
        connected: false,
      },
    });

    this.logger.debug(
      `Unpair-device completed: studentId=${id}, braceletId=${updated.braceletId ?? 'none'}, connected=${updated.connected}`,
    );

    return updated;
  }
}
