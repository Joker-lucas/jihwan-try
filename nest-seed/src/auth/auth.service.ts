import { Injectable } from '@nestjs/common';
import { CreateAuthDto } from './dto/create.auth.dto';
import { AuthRepository } from './auth.repository';
import * as bcrypt from 'bcrypt';
import { User } from '../common/db/models/user';

@Injectable()
export class AuthService {
  constructor(private readonly authRepository: AuthRepository) {}

  async signUp(createAuthDto: CreateAuthDto): Promise<User> {
    const newDto = { ...createAuthDto };

    const saltRounds = 10;
    newDto.password = await bcrypt.hash(newDto.password, saltRounds);

    return this.authRepository.create(newDto);
  }

  async signOut(): Promise<void> {
    return;
  }
}
