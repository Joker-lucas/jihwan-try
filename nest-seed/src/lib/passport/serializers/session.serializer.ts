import { PassportSerializer } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { User } from '../../../common/db/models/user';

@Injectable()
export class SessionSerializer extends PassportSerializer {
  serializeUser(user: User, done: Function) {
    done(null, user);
  }

  deserializeUser(user: User, done: Function) {
    done(null, user);
  }
}
