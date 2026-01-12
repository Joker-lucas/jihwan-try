import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { AuthenticatedGuard } from '../lib/passport/guards/session/authenticated.guard';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async findAll() {
    return this.userService.getAllUsers();
  }

  @UseGuards(AuthenticatedGuard)
  @Get('me')
  getProfile(@Request() req: any) {
    return req.user;
  }
}
