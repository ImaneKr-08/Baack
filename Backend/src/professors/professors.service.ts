import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProfessorDto } from './dto/create-professor.dto';
import { UpdateProfessorDto } from './dto/update-professor.dto';
import * as bcrypt from 'bcrypt';
import { MailService } from '../mail/mail.service';

@Injectable()
export class ProfessorsService {
  constructor(
    private prisma: PrismaService,
    private mailService: MailService,
  ) {}

  async create(createProfessorDto: CreateProfessorDto) {
    const { firstName, lastName, email, password } = createProfessorDto;

    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException('Email already in use');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const professor = await this.prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          firstName,
          lastName,
          email,
          password: hashedPassword,
          role: 'PROFESSOR',
        },
      });

      return tx.professor.create({
        data: {
          userId: user.id,
        },
        include: {
          user: {
            select: {
              id: true,
              role: true,
              createdAt: true,
            },
          },
        },
      });
    });

    try {
      await this.mailService.sendProfessorCredentials(
        email,
        `${firstName} ${lastName}`,
        password,
      );
    } catch (error) {
      console.error('Email sending failed:', error);
    }

    return professor;
  }

  async findAll() {
    return this.prisma.professor.findMany({
      include: {
        user: true,
      },
    });
  }

  async findOne(id: number) {
    const professor = await this.prisma.professor.findUnique({
      where: { id },
      include: {
        user: true,
        exams: true,
      },
    });

    if (!professor) {
      throw new NotFoundException(`Professor with ID ${id} not found`);
    }

    return professor;
  }

  async update(id: number, updateProfessorDto: UpdateProfessorDto) {
    const professor = await this.findOne(id);

    const { firstName, lastName, email, password } = updateProfessorDto;

    if (email) {
      const existingUser = await this.prisma.user.findFirst({
        where: { email, NOT: { id: professor.userId } },
      });

      if (existingUser) {
        throw new ConflictException('Email already in use');
      }
    }

    return this.prisma.$transaction(async (tx) => {
      const userUpdateData: any = {};

      if (firstName) userUpdateData.firstName = firstName;
      if (lastName) userUpdateData.lastName = lastName;

      if (email) {
        userUpdateData.email = email;
      }

      if (password) {
        userUpdateData.password = await bcrypt.hash(password, 10);
      }

      if (Object.keys(userUpdateData).length > 0) {
        await tx.user.update({
          where: {
            id: professor.userId,
          },
          data: userUpdateData,
        });
      }

      return tx.professor.update({
        where: { id },
        data: {},
        include: {
          user: {
            select: {
              id: true,
              role: true,
            },
          },
        },
      });
    });
  }

  async remove(id: number) {
    const professor = await this.findOne(id);

    return this.prisma.user.delete({
      where: {
        id: professor.userId,
      },
    });
  }
}
