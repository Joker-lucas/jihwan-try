import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create.user.dto';
import { UserRepository } from './user.repository';
import { User } from 'src/common/db/models/user';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async getAllUsers(): Promise<User[]> {
    return this.userRepository.findMany();
  }

  async registerUser(createUserDto: CreateUserDto): Promise<User> {
    return this.userRepository.save(createUserDto);
  }

  async findOneByContactEmail(contactEmail: string): Promise<User | null> {
    return this.userRepository.findOneByContactEmail(contactEmail);
  }

  async findOneByUserId(userId: number): Promise<User | null> {
    return this.userRepository.findOneByUserId(userId);
  }
}
