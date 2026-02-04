import { Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { User } from '../common/db/models/user';
import { CustomError } from '../common/error/error';
import { ERROR_CODES } from '../common/error/error-definition';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async getAllUsers(): Promise<User[]> {
    return this.userRepository.findMany();
  }

  async findOneByContactEmail(contactEmail: string): Promise<User | null> {
    return this.userRepository.findOneByContactEmail(contactEmail);
  }

  async findOneByUserId(userId: number): Promise<User | null> {
    const user = await this.userRepository.findOneByUserId(userId);

    if (!user) {
      throw new CustomError(ERROR_CODES.USER_NOT_FOUND);
    }

    return user;
  }
}
