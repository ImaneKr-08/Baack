import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import * as bcrypt from 'bcrypt';
@Injectable()
export class StudentsService {
  constructor(private prisma: PrismaService) {}

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

    return this.prisma.student.create({
      data: {
        ...createStudentDto,
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

  async findOne(id: number) {
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
}
