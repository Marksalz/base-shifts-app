import { Injectable, ConflictException, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { Response } from 'express';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcryptjs';


@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) { }

  private setUserCookie(res: Response, token: string): void {
    res.cookie('jwt_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 1000, // 1 hour
    });
  }

  async signup(signupDto: SignupDto, res: Response): Promise<any> {
    try {
      const user = await this.usersService.create(signupDto);
      const payload = { sub: user.id, username: user.username, role: user.role };
      const token = await this.jwtService.signAsync(payload);

      this.setUserCookie(res, token);

      return { user, access_token: token };

    } catch (err) {
      console.log('Create failed:', err.message);

      if (err.name === 'SequelizeUniqueConstraintError') {
        throw new ConflictException('Email or username already exists');
      }

      throw new BadRequestException('Failed to create user: ' + err.message);
    }
  }

  async login(loginDto: LoginDto, res: Response): Promise<any> {
    const user = await this.usersService.findByUsername(loginDto.username);
    if (!user) {
      throw new UnauthorizedException('Invalid username or password');
    }

    const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid username or password');
    }

    const payload = { sub: user.id, username: user.username, role: user.role };
    const token = await this.jwtService.signAsync(payload);

    this.setUserCookie(res, token);

    const plainUser = user.get({ plain: true });
    const { password, ...userWithoutPassword } = plainUser;

    return { user: userWithoutPassword, access_token: token };
  }

  logout(userId: number, req: any, res: Response): { message: string } {
    try {
      if (req.user.id !== userId) {
        throw new UnauthorizedException('You can only logout your own session');
      }

      res.clearCookie('jwt_token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
      });

      return { message: 'Logged out successfully' };
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new BadRequestException('Failed to logout user');
    }
  }
}
