import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) { }

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

    return this.generateTokens(user);
  }

  async refreshTokens(userId: number) {
    const user = await this.usersService.findById(userId);

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return this.generateTokens(user as any);
  }

  private generateTokens(user: any) {
    const userId = user.id;
    const name = `${user.firstName} ${user.lastName}`;
    const email = user.email;
    const role = user.role;
    
    const payload = {
      sub: userId,
      email,
      role,
    };

    const accessToken = this.jwtService.sign(payload, {
      secret:
        process.env.JWT_SECRET ||
        'proctor_insight_jwt_secret_key_2026_xyz',
      expiresIn: '60m',
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
        id: user.student ? user.student.id : (user.professor ? user.professor.id : userId),
        studentCode: user.student ? user.student.studentCode : undefined,
        name,
        email,
        role,
      },
    };
  }
}
