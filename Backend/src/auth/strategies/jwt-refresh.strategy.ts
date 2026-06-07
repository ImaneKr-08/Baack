import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from '../../users/users.service';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor(
    private usersService: UsersService,
    private prisma: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromBodyField('refreshToken'),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_REFRESH_SECRET || 'proctor_insight_jwt_refresh_secret_key_2026_xyz',
    });
  }

  async validate(payload: any) {
    if (payload.role === 'STUDENT') {
      const student = await this.prisma.student.findUnique({
        where: { id: payload.sub },
      });
      if (!student) {
        throw new UnauthorizedException('Student not found');
      }
      return { id: student.id, email: student.email, role: 'STUDENT', isStudent: true };
    }

    const user = await this.usersService.findById(payload.sub);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    return { id: user.id, email: user.email, role: user.role };
  }
}
