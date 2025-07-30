import { Controller, Get, Post, Body, Patch, Param, Delete, Res } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { LogoutDto } from './dto/logout.dto';

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

  // @Post('logout')
  // logout(@Body() logoutDto: LogoutDto) {
  //   return this.authService.logout(logoutDto);
  // }

  @Get('profile')
  profile() {
    return this.authService.profile();
  }
}
