import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { User } from '../user/user.entity';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: { email: string, password: string }) {
    const user = new User();
    user.email = loginDto.email;
    user.password = loginDto.password;
    return this.authService.login(user.email, user.password);
  }
}