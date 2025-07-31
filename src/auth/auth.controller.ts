import { Controller, Get, Post, Body, Res, UseGuards, Param, Req } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { AuthGuard } from '../auth/auth.guard';
import { AuthenticatedRequest } from 'src/types/request.types';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('signup')
  signup(@Body() signupDto: SignupDto, @Res({ passthrough: true }) res: Response) {
    return this.authService.signup(signupDto, res);
  }

  @Post('login')
  login(@Body() loginDto: LoginDto, @Res({ passthrough: true }) res: Response) {
    return this.authService.login(loginDto, res);
  }

  @Post('logout/:id')
  @UseGuards(AuthGuard)
  logout(@Param('id') userId: number, @Req() req: AuthenticatedRequest, @Res({ passthrough: true }) res: Response) {
    return this.authService.logout(userId, req, res);
  }
}
