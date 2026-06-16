import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateClassroomDto } from './dto/create-classroom.dto';
import { UpdateClassroomDto } from './dto/update-classroom.dto';

@Injectable()
export class ClassroomsService {
  constructor(private prisma: PrismaService) {}

  async create(createClassroomDto: CreateClassroomDto) {
    return this.prisma.classroom.create({
      data: createClassroomDto,
    });
  }

  async findAll() {
    return this.prisma.classroom.findMany({
      include: {
        tables: {
          orderBy: [{ positionY: 'asc' }, { positionX: 'asc' }],
        },
      },
      orderBy: {
        name: 'asc',
      },
    });
  }

  async findOne(id: number) {
    const classroom = await this.prisma.classroom.findUnique({
      where: { id },
      include: {
        tables: true,
        exams: true,
      },
    });

    if (!classroom) {
      throw new NotFoundException(`Classroom with ID ${id} not found`);
    }

    return classroom;
  }

  async update(id: number, updateClassroomDto: UpdateClassroomDto) {
    const classroom = await this.findOne(id);

    const newRows = updateClassroomDto.rows ?? classroom.rows;

    const newColumns = updateClassroomDto.columns ?? classroom.columns;

    const tableOutsideBounds = classroom.tables.some(
      (table) => table.positionX >= newColumns || table.positionY >= newRows,
    );

    if (tableOutsideBounds) {
      throw new Error(
        'Cannot resize classroom because some tables would be outside the new dimensions.',
      );
    }

    return this.prisma.classroom.update({
      where: { id },
      data: updateClassroomDto,
    });
  }
  async updateLayout(
    classroomId: number,
    tables: {
      id: number;
      positionX: number;
      positionY: number;
    }[],
  ) {
    await this.findOne(classroomId);

    return this.prisma.$transaction(
      tables.map((table) =>
        this.prisma.table.updateMany({
          where: {
            id: table.id,
          },
          data: {
            positionX: table.positionX,
            positionY: table.positionY,
          },
        }),
      ),
    );
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.classroom.delete({
      where: { id },
    });
  }
}
