import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { DbModule } from '../common/db/db.module';
import { UserRepository } from './user.repository';
import { PassportAuthModule } from '../lib/passport/passport.module';

@Module({
  imports: [DbModule, PassportAuthModule],
  providers: [UserService, UserRepository],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
