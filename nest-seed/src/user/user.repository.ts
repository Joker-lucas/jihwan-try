import { Inject, Injectable } from '@nestjs/common';
import { User } from 'src/common/db/models/user';

@Injectable()
export class UserRepository {
  constructor(
    @Inject('USER_MODEL')
    private readonly userModel: typeof User,
  ) {}

  async findMany(): Promise<User[]> {
    return this.userModel.findAll();
  }

  async findOneByContactEmail(contactEmail: string): Promise<User | null> {
    return this.userModel.findOne({ where: { contactEmail } });
  }

  async findOneByUserId(userId: number): Promise<User | null> {
    return this.userModel.findByPk(userId);
  }
}
