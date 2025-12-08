import { Module } from '@nestjs/common';
import { DbModule } from './db/db.module';
import { RedisModule } from './redis/redis.module';

@Module({
  imports: [DbModule, RedisModule],
  providers: [],
  exports: [DbModule, RedisModule],
})
export class CommonModule {}
