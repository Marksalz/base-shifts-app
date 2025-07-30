import { Injectable, ConflictException, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { Response } from 'express';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { LogoutDto } from './dto/logout.dto';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcryptjs';


@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) { }

  private setUserCookie(res: Response, userId: number, token: string): void {
    res.cookie(`jwt_user_${userId}`, token, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 60 * 60 * 1000, // 1 hour (match JWT expiration)
    });
  }

  async signup(signupDto: SignupDto, res: Response): Promise<any> {
    try {
      const user = await this.usersService.create(signupDto);
      const payload = { sub: user.id, username: user.username, role: user.role };
      const token = await this.jwtService.signAsync(payload);

      this.setUserCookie(res, user.id, token);

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

    this.setUserCookie(res, user.id, token);

    const plainUser = user.get({ plain: true });
    const { password, ...userWithoutPassword } = plainUser;

    return { user: userWithoutPassword, access_token: token };
  }

  // logout(logoutDto: LogoutDto) {
  //   // In JWT-based auth, logout is typically handled on the client by deleting the token.
  //   // Optionally, you can implement token blacklisting here if needed.
  //   return { message: 'User logged out successfully' };
  // }

  profile() {
    return 'This returns a logged in users profile from token';
  }
}
