import {
  Inject,
  Module,
  OnModuleInit,
  OnApplicationShutdown,
} from '@nestjs/common';
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
export class AppModule implements OnModuleInit, OnApplicationShutdown {
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

  async onApplicationShutdown(signal: string) {
    console.log(`Received signal: ${signal}. Starting graceful shutdown...`);

    const WAIT_TIME = 5000;
    await new Promise((resolve) => setTimeout(resolve, WAIT_TIME));

    try {
      await this.redisService.close();
      await this.dbService.close();
    } catch (error) {
      console.log('Error during disconnection', error);
    }
    console.log('Application shutdown complete.');
  }
}
