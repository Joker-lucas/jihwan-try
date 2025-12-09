import { Inject, Module, OnModuleInit } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { ConfigModule } from './config/config.module';
import { CommonModule } from './common/common.module';
import { DbService } from './common/db/db.service';
import { RedisService } from './common/redis/redis.service';

@Module({
  imports: [UserModule, ConfigModule, CommonModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements OnModuleInit {
  constructor(
    @Inject('DB_SERVICE')
    private readonly dbService: DbService,
    @Inject('REDIS_SERVICE')
    private readonly redisService: RedisService,
  ) {}

  async onModuleInit() {
    await this.dbService.init();
    await this.redisService.init();
  }
}
