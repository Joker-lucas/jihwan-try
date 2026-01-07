import {
  Controller,
  Post,
  Request,
  Body,
  Get,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { CreateAuthDto } from './dto/create.auth.dto';
import { LoginUserDto } from './dto/login.user.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  async signup(@Body() createAuthDto: CreateAuthDto) {
    const result = await this.authService.signup(createAuthDto);
    return { message: 'User registration initiated (skeleton)', result };
  }

  @Post('signin')
  async login(
    @Body() loginDto: LoginUserDto,
    @Request() req: any,
    @Res({ passthrough: true }) res: Response,
  ) {
    const user = await this.authService.login(loginDto);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials (skeleton)');
    }

    req.session.userId = user.userId;
    return {
      message: 'Login successful (skeleton)!',
      user: { userId: user.userId, contactEmail: user.contactEmail },
    };
  }

  @Post('signout')
  logout(@Request() req: any, @Res({ passthrough: true }) res: Response) {
    req.session.destroy((err: any) => {
      if (err) {
        console.error('Error destroying session (skeleton):', err);
      }
      res.clearCookie('connect.sid');
    });
    return { message: 'Logout successful (skeleton)!' };
  }

  @Get('profile')
  getProfile(@Request() req: any) {
    if (!req.session || !req.session.userId) {
      throw new UnauthorizedException('Login required (skeleton).');
    }
    return { message: 'Profile info (skeleton)', userId: req.session.userId };
  }
}
