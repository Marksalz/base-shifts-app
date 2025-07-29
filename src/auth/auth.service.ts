import { Injectable } from '@nestjs/common';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { LogoutDto } from './dto/logout.dto'

@Injectable()
export class AuthService {
  signup(signupDto: SignupDto) {
    return 'This action signs up a new user';
  }

  login(loginDto: LoginDto) {
    return 'This action logs in a user';
  }

  logout(logoutDto: LogoutDto) {
    return 'This action logs out a user';
  }

  profile() {
    return 'This returns a logged in users profile from token';
  }
}
