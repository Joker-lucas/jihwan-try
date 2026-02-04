import {
  Controller,
  Post,
  Body,
  Request,
  Res,
  UseGuards,
  Inject,
  Injectable,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import type { Response } from 'express';
import { CreateAuthDto } from './dto/create.auth.dto';
import { SigninResponseDto, SignoutResponseDto, UserInfo } from './dto/res.dto';
import { LocalAuthGuard } from '../lib/passport/guards/local/local-auth.guard';
import { MyLogger } from 'src/lib/logger/logger.service';
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private readonly logger: MyLogger,
  ) {}

  @Post('signup')
  async signUp(@Body() createAuthDto: CreateAuthDto): Promise<UserInfo> {
    const result = await this.authService.signUp(createAuthDto);
    return {
      contactEmail: result.contactEmail,
      name: result.name,
    };
  }

  @UseGuards(LocalAuthGuard)
  @Post('signin')
  async signIn(
    @Request() req: any,
    @Res({ passthrough: true }) res: Response,
  ): Promise<SigninResponseDto> {
    const user = req.user;

    return {
      message: 'Login successful!',
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
          this.logger.log(`로그아웃 성공`, 'Auth');
          resolve();
        }
      });
      res.clearCookie('sssssssssid');
    });

    return {
      message: 'Logout successful (skeleton)!',
    };
  }
}
