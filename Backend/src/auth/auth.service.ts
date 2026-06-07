import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private prisma: PrismaService,
  ) {}

  async login(loginDto: LoginDto) {
    const user = await this.usersService.findByEmail(loginDto.email);

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isMatch = await bcrypt.compare(
      loginDto.password,
      user.password,
    );

    if (!isMatch) {
      throw new UnauthorizedException('Invalid email or password');
    }

    return this.generateTokens(
      user.id,
      user.name,
      user.email,
      user.role,
    );
  }

  async studentLogin(loginDto: { identifier: string; password?: string }) {
    const student = await this.prisma.student.findFirst({
      where: {
        OR: [
          { email: loginDto.identifier },
          { studentCode: loginDto.identifier },
        ],
      },
    });

    if (!student) {
      throw new UnauthorizedException('Invalid student code, email, or password');
    }

    if (loginDto.password) {
      const isMatch = await bcrypt.compare(loginDto.password, student.password);
      if (!isMatch) {
        throw new UnauthorizedException('Invalid student code, email, or password');
      }
    }

    const tokens = this.generateTokens(
      student.id,
      `${student.firstName} ${student.lastName}`.trim(),
      student.email,
      'STUDENT',
    );

    return {
      access_token: tokens.accessToken,
      refresh_token: tokens.refreshToken,
      student: {
        id: student.id,
        studentCode: student.studentCode,
        email: student.email,
        firstName: student.firstName,
        lastName: student.lastName,
      },
    };
  }

  async refreshTokens(userId: number) {
    const user = await this.usersService.findById(userId);

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return this.generateTokens(
      user.id,
      user.name,
      user.email,
      user.role,
    );
  }

  private generateTokens(
    userId: number,
    name: string,
    email: string,
    role: string,
  ) {
    const payload = {
      sub: userId,
      email,
      role,
    };

    const accessToken = this.jwtService.sign(payload, {
      secret:
        process.env.JWT_SECRET ||
        'proctor_insight_jwt_secret_key_2026_xyz',
      expiresIn: '15m',
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret:
        process.env.JWT_REFRESH_SECRET ||
        'proctor_insight_jwt_refresh_secret_key_2026_xyz',
      expiresIn: '7d',
    });

    return {
      accessToken,
      refreshToken,
      user: {
        id: userId,
        name,
        email,
        role,
      },
    };
  }
}
