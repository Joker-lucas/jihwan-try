import { Inject, Injectable } from '@nestjs/common';
import { User } from 'src/common/db/models/user';
import { CreateUserDto } from './dto/create.user.dto';

@Injectable()
export class UserRepository {
  constructor(
    @Inject('USER_MODEL')
    private readonly userModel: typeof User,
  ) {}

  async findMany(): Promise<User[]> {
    return this.userModel.findAll();
  }

  async save(createUserDto: CreateUserDto): Promise<User> {
    return this.userModel.create(createUserDto);
  }
}
