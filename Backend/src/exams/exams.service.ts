import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateExamDto } from './dto/create-exam.dto';
import { UpdateExamDto } from './dto/update-exam.dto';
import { RealtimeGateway } from '../realtime/gateways/realtime.gateways';

@Injectable()
export class ExamsService {
  constructor(
    private prisma: PrismaService,
    private realtimeGateway: RealtimeGateway,
  ) {}

  async create(createExamDto: CreateExamDto) {
    const { classroomId, professorId } = createExamDto;

    const classroom = await this.prisma.classroom.findUnique({
      where: { id: classroomId },
    });
    if (!classroom) {
      throw new NotFoundException(`Classroom with ID ${classroomId} not found`);
    }

    const professor = await this.prisma.professor.findUnique({
      where: { id: professorId },
    });
    if (!professor) {
      throw new NotFoundException(`Professor with ID ${professorId} not found`);
    }

    return this.prisma.exam.create({
      data: {
        title: createExamDto.title,
        module: createExamDto.module,
        examDate: new Date(createExamDto.examDate),
        startTime: new Date(createExamDto.startTime),
        endTime: new Date(createExamDto.endTime),
        classroomId,
        professorId,
        status: 'PENDING',
      },
    });
  }

  async findAll() {
    return this.prisma.exam.findMany({
      include: {
        classroom: true,
        professor: true,
        _count: {
          select: { examStudents: true },
        },
      },
      orderBy: { startTime: 'desc' },
    });
  }

  async findOne(id: number) {
    const exam = await this.prisma.exam.findUnique({
      where: { id },
      include: {
        classroom: true,
        professor: true,
        examStudents: {
          include: {
            student: true,
            table: true,
          },
        },
        monitoringSessions: true,
      },
    });

    if (!exam) {
      throw new NotFoundException(`Exam with ID ${id} not found`);
    }

    return exam;
  }

  async update(id: number, updateExamDto: UpdateExamDto) {
    await this.findOne(id);

    const data: any = { ...updateExamDto };
    if (updateExamDto.examDate) data.examDate = new Date(updateExamDto.examDate);
    if (updateExamDto.startTime) data.startTime = new Date(updateExamDto.startTime);
    if (updateExamDto.endTime) data.endTime = new Date(updateExamDto.endTime);

    return this.prisma.exam.update({
      where: { id },
      data,
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.exam.delete({
      where: { id },
    });
  }

  async assignProfessor(id: number, professorId: number) {
    await this.findOne(id);
    const professor = await this.prisma.professor.findUnique({
      where: { id: professorId },
    });
    if (!professor) {
      throw new NotFoundException(`Professor with ID ${professorId} not found`);
    }

    return this.prisma.exam.update({
      where: { id },
      data: { professorId },
    });
  }

  async assignStudents(id: number, assignments: { studentId: number; tableId: number }[]) {
    const exam = await this.findOne(id);

    for (const assignment of assignments) {
      const student = await this.prisma.student.findUnique({
        where: { id: assignment.studentId },
      });
      if (!student) {
        throw new NotFoundException(`Student with ID ${assignment.studentId} not found`);
      }

      const table = await this.prisma.table.findUnique({
        where: { id: assignment.tableId },
      });
      if (!table) {
        throw new NotFoundException(`Table with ID ${assignment.tableId} not found`);
      }

      if (table.classroomId !== exam.classroomId) {
        throw new BadRequestException(
          `Table ${table.id} is in Classroom ${table.classroomId}, but exam is in Classroom ${exam.classroomId}`,
        );
      }
    }

    return this.prisma.$transaction(async (tx) => {
      await tx.examStudent.deleteMany({
        where: { examId: id },
      });

      const createdAssignments: any[] = [];
      for (const assignment of assignments) {
        const res = await tx.examStudent.create({
          data: {
            examId: id,
            studentId: assignment.studentId,
            tableId: assignment.tableId,
          },
        });
        createdAssignments.push(res);
      }

      return createdAssignments;
    });
  }

  async start(id: number) {
    const exam = await this.findOne(id);
    if (exam.status !== 'PENDING') {
      throw new BadRequestException(`Cannot start an exam that is currently in status: ${exam.status}`);
    }

    return this.prisma.$transaction(async (tx) => {
      const updatedExam = await tx.exam.update({
        where: { id },
        data: { status: 'ONGOING' },
      });

      const session = await tx.monitoringSession.create({
        data: {
          examId: id,
          active: true,
          startedAt: new Date(),
        },
      });

      this.realtimeGateway.sendSessionStarted({
        sessionId: session.id,
        examId: id,
        title: exam.title,
      });

      return {
        message: 'Exam started successfully',
        exam: updatedExam,
        session,
      };
    });
  }

  async end(id: number) {
    const exam = await this.findOne(id);
    if (exam.status !== 'ONGOING') {
      throw new BadRequestException(`Cannot end an exam that is in status: ${exam.status}`);
    }

    return this.prisma.$transaction(async (tx) => {
      const updatedExam = await tx.exam.update({
        where: { id },
        data: { status: 'COMPLETED' },
      });

      const activeSession = await tx.monitoringSession.findFirst({
        where: { examId: id, active: true },
      });

      let endedSession: any = null;
      if (activeSession) {
        endedSession = await tx.monitoringSession.update({
          where: { id: activeSession.id },
          data: {
            active: false,
            endedAt: new Date(),
          },
        });

        const assignedStudents = await tx.examStudent.findMany({
          where: { examId: id },
          select: { studentId: true },
        });

        const studentIds = assignedStudents.map((as) => as.studentId);
        if (studentIds.length > 0) {
          await tx.student.updateMany({
            where: { id: { in: studentIds } },
            data: {
              connected: false,
              heartRate: null,
              stressScore: null,
              stressLevel: null,
            },
          });
        }

        this.realtimeGateway.sendSessionEnded({
          sessionId: endedSession.id,
          examId: id,
        });
      }

      return {
        message: 'Exam ended successfully',
        exam: updatedExam,
        session: endedSession,
      };
    });
  }
}
