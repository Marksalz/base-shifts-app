import { Controller, Get, Post, Body, Res, Req, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { LogoutDto } from './dto/logout.dto';
import { AuthGuard } from '../auth/auth.guard';

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

  @Post('logout')
  @UseGuards(AuthGuard)
  logout(@Body() logoutDto: LogoutDto, @Res({ passthrough: true }) res: Response) {
    return this.authService.logout(logoutDto, res);
  }

  @Get('profile')
  @UseGuards(AuthGuard)
  profile() {
    return this.authService.profile();
  }
}
