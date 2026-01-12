import { Inject, Injectable } from '@nestjs/common';
import { User } from '../common/db/models/user';
import { CreateAuthDto } from './dto/create.auth.dto';
import { BasicCredential } from '../common/db/models/basic-credential';
import { DbService } from '../common/db/db.service';

@Injectable()
export class AuthRepository {
  sequelize: any;
  constructor(
    @Inject('USER_MODEL')
    private userModel: typeof User,
    @Inject('BASIC_CREDENTIAL_MODEL')
    private basicCredentialModel: typeof BasicCredential,
    @Inject('DB_SERVICE')
    private dbService: DbService,
  ) {}

  async create(createAuthDto: CreateAuthDto): Promise<User> {
    const sequelize = this.dbService.getSequelize();
    const t = await sequelize.transaction();
    try {
      const newUser = await this.userModel.create(
        {
          name: createAuthDto.name,
          contactEmail: createAuthDto.contactEmail,
        },
        { transaction: t },
      );

      await this.basicCredentialModel.create(
        {
          userId: newUser.userId,
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
