import { Injectable } from '@nestjs/common';
import { CreateAuthDto } from './dto/create.auth.dto';
import { LoginUserDto } from './dto/login.user.dto';
import { AuthRepository } from './auth.repository';
import * as bcrypt from 'bcrypt';
import { User } from '../common/db/models/user';

@Injectable()
export class AuthService {
  constructor(private readonly authRepository: AuthRepository) {}

  async signup(createAuthDto: CreateAuthDto): Promise<User> {
    const newDto = { ...createAuthDto };

    const saltRounds = 10;
    newDto.password = await bcrypt.hash(newDto.password, saltRounds);

    return this.authRepository.create(newDto);
  }

  async validateUser(loginEmail: string, pass: string): Promise<User | null> {
    const basicCredential =
      await this.authRepository.findByLoginEmail(loginEmail);

    if (basicCredential && basicCredential.user) {
      const isPasswordMatching = await bcrypt.compare(
        pass,
        basicCredential.password,
      );

      if (isPasswordMatching) {
        return basicCredential.user;
      }
    }
    return null;
  }

  async login(loginUserDto: LoginUserDto): Promise<User | null> {
    const user = await this.validateUser(
      loginUserDto.contactEmail, // Use contactEmail from DTO as loginEmail
      loginUserDto.password,
    );
    if (!user) {
      return null;
    }
    return user;
  }

  async logout(): Promise<void> {
    console.log('Logout logic placeholder');
  }
}
