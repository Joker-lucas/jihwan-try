import { Module, OnModuleInit } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { DbModule } from './common/db/db.module';
import { DbService } from './common/db/db.service';
import { ConfigModule } from './config/config.module';
import { RedisModule } from './common/redis/redis.module';
import { RedisService } from './common/redis/redis.service';

@Module({
  imports: [UserModule, ConfigModule, DbModule, RedisModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements OnModuleInit {
  constructor(
    private readonly dbService: DbService,
    private readonly redisService: RedisService,
  ) {}

  async onModuleInit() {
    await this.dbService.init();
    await this.redisService.init();
  }
}
