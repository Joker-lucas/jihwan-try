import { Injectable } from '@nestjs/common';
import { CreateAuthDto } from './dto/create.auth.dto';
import { SigninUserDto } from './dto/signin.user.dto';
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

  async validateUser(loginEmail: string, pass: string): Promise<any> {
    const basicCredential =
      await this.authRepository.findByLoginEmail(loginEmail);

    if (basicCredential && basicCredential.user) {
      const isPasswordMatching = await bcrypt.compare(
        pass,
        basicCredential.password,
      );

      if (isPasswordMatching) {
        const userPayload = basicCredential.user;

        return userPayload;
      }
    }
    return null;
  }

  async signIn(signinUserDto: SigninUserDto): Promise<User | null> {
    const user = await this.validateUser(
      signinUserDto.contactEmail,
      signinUserDto.password,
    );
    if (!user) {
      return null;
    }
    return user;
  }

  async signOut(): Promise<void> {
    console.log('Logout logic placeholder');
    return;
  }
}
