import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { BasicCredential } from '../../../common/db/models/basic-credential';
import { User } from '../../../common/db/models/user';
import * as bcrypt from 'bcrypt';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
  constructor(
    @Inject('BASIC_CREDENTIAL_MODEL')
    private readonly basicCredentialModel: typeof BasicCredential,
  ) {
    super({
      usernameField: 'contactEmail',
      passwordField: 'password',
    });
  }

  async validate(contactEmail: string, password: string): Promise<any> {
    const credential = await this.basicCredentialModel.findOne({
      where: { loginEmail: contactEmail },
      include: [User],
    });

    if (!credential) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordMatching = await bcrypt.compare(
      password,
      credential.password,
    );

    if (!isPasswordMatching) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return credential.user;
  }
}
