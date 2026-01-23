import { PassportSerializer } from '@nestjs/passport';
import { Injectable, Inject } from '@nestjs/common';
import { User } from '../../../common/db/models/user';
import { MyLogger } from '../../../lib/logger/logger.service';

@Injectable()
export class SessionSerializer extends PassportSerializer {
  constructor(@Inject('LOGGER_SERVICE') private readonly logger: MyLogger) {
    super();
  }
  serializeUser(user: User, done: Function) {
    this.logger.log(
      `[Session] 유저 정보를 세션에 저장함, 유저 아이디: ${user.userId}`,
      'Passport',
    );
    done(null, user);
  }

  deserializeUser(user: User, done: Function) {
    done(null, user);
  }
}
