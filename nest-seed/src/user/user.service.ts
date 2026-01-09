import { Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { User } from 'src/common/db/models/user';

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
    return this.userRepository.findOneByUserId(userId);
  }
}
