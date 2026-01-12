import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from 'src/user/user.module';
import { LocalStrategy } from './strategies/local.strategy';
import { SessionSerializer } from './serializers/session.serializer';
import { DbModule } from 'src/common/db/db.module';

@Module({
  imports: [DbModule, UserModule, PassportModule.register({ session: true })],
  providers: [LocalStrategy, SessionSerializer],
  exports: [PassportModule],
})
export class PassportAuthModule {}
