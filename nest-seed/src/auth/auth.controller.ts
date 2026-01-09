import {
  Controller,
  Post,
  Body,
  Request,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import type { Response } from 'express';

import { CreateAuthDto } from './dto/create.auth.dto';
import { SigninUserDto } from './dto/signin.user.dto';
import { SigninResponseDto, SignoutResponseDto, UserInfo } from './dto/res.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  async signUp(@Body() createAuthDto: CreateAuthDto): Promise<UserInfo> {
    const result = await this.authService.signUp(createAuthDto);
    return {
      contactEmail: result.contactEmail,
      name: result.name,
    };
  }

  @Post('signin')
  async signIn(
    @Body() loginDto: SigninUserDto,
    @Request() req: any,
    @Res({ passthrough: true }) res: Response,
  ): Promise<SigninResponseDto> {
    const user = await this.authService.signIn(loginDto);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials (skeleton)');
    }
    req.session.userId = user.userId;

    console.log('--- 로그인 시도 중 디버깅 로그 ---');
    console.log('1. User 객체 확인:', user.userId, user.contactEmail);
    console.log('2. Request 객체 존재 여부:', !!req);
    console.log('3. Session 객체 존재 여부:', !!req.session);

    return {
      message: 'Login successful (skeleton)!',
      user: { contactEmail: user.contactEmail, name: user.name },
    };
  }

  @Post('signout')
  async signOut(
    @Request() req: any,
    @Res({ passthrough: true }) res: Response,
  ): Promise<SignoutResponseDto> {
    await new Promise<void>((resolve, reject) => {
      req.session.destroy((err: any) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
      res.clearCookie('sssssssssid');
    });

    return Promise.resolve({
      message: 'Logout successful (skeleton)!',
    });
  }
}
