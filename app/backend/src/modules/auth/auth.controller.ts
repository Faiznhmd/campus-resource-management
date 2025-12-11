import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  Req,
  Res,
} from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { RegisterDto } from '../../user/dto/register.dto';
import { LoginDto } from '../../user/dto/login.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { AdminGuard } from './role.guard';
import type { Request } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }
  // @Get()
  // getAllUsers() {
  //   return this.authService.getAllUsers();
  // }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Get('users')
  getAllUsers() {
    return this.authService.getAllUsers();
  }

  // 🔥 NEW: Get logged-in user details
  @Get('me')
  @UseGuards(JwtAuthGuard)
  getMe(@Req() req: Request) {
    return req.user;
  }

  // auth.controller.ts

  @Post('logout')
  logout(@Res({ passthrough: true }) res) {
    res.clearCookie('token'); // NOW WORKS (any adapter)
    return { message: 'Logged out' };
  }
}
