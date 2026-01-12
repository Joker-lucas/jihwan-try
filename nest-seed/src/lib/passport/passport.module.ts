import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './strategies/local.strategy';
import { SessionSerializer } from './serializers/session.serializer';
import { DbModule } from '../../common/db/db.module';

@Module({
  imports: [DbModule, PassportModule.register({ session: true })],
  providers: [LocalStrategy, SessionSerializer],
  exports: [PassportModule],
})
export class PassportAuthModule {}
