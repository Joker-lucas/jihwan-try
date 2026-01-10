import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthRepository } from './auth.repository';
import { DbModule } from '../common/db/db.module';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './local.strategy';
import { SessionSerializer } from './session.serializer';

@Module({
  imports: [DbModule, PassportModule.register({ session: true })],
  controllers: [AuthController],
  providers: [AuthService, AuthRepository, LocalStrategy, SessionSerializer],
  exports: [AuthService],
})
export class AuthModule {}
