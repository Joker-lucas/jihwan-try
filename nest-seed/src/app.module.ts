import { Inject, Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { ConfigModule } from './config/config.module';
import { CommonModule } from './common/common.module';
import { AuthModule } from './auth/auth.module';
import { DbService } from './common/db/db.service';
import { RedisService } from './common/redis/redis.service';
import { ErrorModule } from './lib/error/error.module';

@Module({
  imports: [ConfigModule, CommonModule, UserModule, AuthModule, ErrorModule],
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
  }

  async onModuleDestroy() {
    const WAIT_TIME = 5000;
    await new Promise((resolve) => setTimeout(resolve, WAIT_TIME));
  }

  async beforeApplicationShutdown(signal: string) {
    console.log(`Received signal: ${signal}. Starting graceful shutdown...`);
    try {
      await this.dbService.close();
      await this.redisService.close();
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
