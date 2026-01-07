import { Inject, Injectable } from '@nestjs/common';
import { User } from '../common/db/models/user';
import { CreateAuthDto } from './dto/create.auth.dto';
import { BasicCredential } from '../common/db/models/basic-credential';
import { Sequelize } from 'sequelize-typescript';

@Injectable()
export class AuthRepository {
  constructor(
    @Inject('USER_MODEL')
    private userModel: typeof User,
    @Inject('BASIC_CREDENTIAL_MODEL')
    private basicCredentialModel: typeof BasicCredential,
    @Inject('SEQUELIZE')
    private sequelize: Sequelize,
  ) {}

  async create(createAuthDto: CreateAuthDto): Promise<User> {
    const t = await this.sequelize.transaction();
    try {
      const newUser = await this.userModel.create(
        {
          nickname: createAuthDto.nickname,
          contactEmail: createAuthDto.contactEmail,
        },
        { transaction: t },
      );

      await this.basicCredentialModel.create(
        {
          userId: newUser.id,
          loginEmail: createAuthDto.contactEmail,
          password: createAuthDto.password,
        },
        { transaction: t },
      );

      await t.commit();
      return newUser;
    } catch (error) {
      await t.rollback();
      throw error;
    }
  }

  async findByLoginEmail(loginEmail: string): Promise<BasicCredential | null> {
    return this.basicCredentialModel.findOne({
      where: { loginEmail },
      include: [User],
    });
  }
}
