import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthRepository } from './auth.repository';
import { DbModule } from '../common/db/db.module';
import { PassportAuthModule } from 'src/lib/passport/passport.module';

@Module({
  imports: [DbModule, PassportAuthModule],
  controllers: [AuthController],
  providers: [AuthService, AuthRepository],
  exports: [AuthService, AuthRepository],
})
export class AuthModule {}
