import { Inject, Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
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
export class AppModule implements NestModule {
  constructor(
    @Inject('DB_SERVICE')
    private readonly dbService: DbService,
    @Inject('REDIS_SERVICE')
    private readonly redisService: RedisService,
  ) {}

  configure(consumer: MiddlewareConsumer) {}

  async onModuleInit() {
    await this.dbService.init();
    await this.redisService.init();
  }

  async onModuleDestroy() {
    const WAIT_TIME = 5000;
    await new Promise((resolve) => setTimeout(resolve, WAIT_TIME));
  }

  async beforeApplicationShutdown(signal: string) {
    console.log(`Received signal: ${signal}. Starting graceful shutdown...`);
    try {
      await this.redisService.close();
      await this.dbService.close();
    } catch (error) {
      console.log('Error during disconnection', error);
    }
  }

  onApplicationShutdown() {
    console.log('Application shutdown complete.');
    console.log('server terminated');
    process.exit(2);
  }
}
