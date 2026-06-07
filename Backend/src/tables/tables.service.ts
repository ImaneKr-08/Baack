import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTableDto } from './dto/create-table.dto';
import { UpdateTableDto } from './dto/update-table.dto';

@Injectable()
export class TablesService {
  constructor(private prisma: PrismaService) {}

  async create(createTableDto: CreateTableDto) {
    const { classroomId, positionX, positionY } = createTableDto;

    const classroom = await this.prisma.classroom.findUnique({
      where: { id: classroomId },
    });
    if (!classroom) {
      throw new NotFoundException(`Classroom with ID ${classroomId} not found`);
    }

    if (positionX >= classroom.columns || positionY >= classroom.rows) {
      throw new ConflictException(
        `Position (${positionX}, ${positionY}) is out of classroom bounds (${classroom.columns}x${classroom.rows})`,
      );
    }

    const existingTable = await this.prisma.table.findFirst({
      where: { classroomId, positionX, positionY },
    });
    if (existingTable) {
      throw new ConflictException(`A table already exists at position (${positionX}, ${positionY})`);
    }

    return this.prisma.table.create({
      data: createTableDto,
    });
  }

  async findAll(classroomId?: number) {
    return this.prisma.table.findMany({
      where: classroomId ? { classroomId } : undefined,
      include: {
        classroom: true,
      },
      orderBy: [
        { classroomId: 'asc' },
        { positionY: 'asc' },
        { positionX: 'asc' },
      ],
    });
  }

  async findOne(id: number) {
    const table = await this.prisma.table.findUnique({
      where: { id },
      include: { classroom: true },
    });
    if (!table) {
      throw new NotFoundException(`Table with ID ${id} not found`);
    }
    return table;
  }

  async update(id: number, updateTableDto: UpdateTableDto) {
    const table = await this.findOne(id);
    const classroomId = updateTableDto.classroomId ?? table.classroomId;
    const positionX = updateTableDto.positionX ?? table.positionX;
    const positionY = updateTableDto.positionY ?? table.positionY;

    if (
      updateTableDto.classroomId ||
      updateTableDto.positionX !== undefined ||
      updateTableDto.positionY !== undefined
    ) {
      const classroom = await this.prisma.classroom.findUnique({
        where: { id: classroomId },
      });
      if (!classroom) {
        throw new NotFoundException(`Classroom with ID ${classroomId} not found`);
      }

      if (positionX >= classroom.columns || positionY >= classroom.rows) {
        throw new ConflictException(
          `Position (${positionX}, ${positionY}) is out of classroom bounds (${classroom.columns}x${classroom.rows})`,
        );
      }

      const existingTable = await this.prisma.table.findFirst({
        where: { classroomId, positionX, positionY, NOT: { id } },
      });
      if (existingTable) {
        throw new ConflictException(`A table already exists at position (${positionX}, ${positionY})`);
      }
    }

    return this.prisma.table.update({
      where: { id },
      data: updateTableDto,
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.table.delete({
      where: { id },
    });
  }
}
