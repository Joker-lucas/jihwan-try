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
import { LoggerModule } from './lib/logger/logger.module';
import { MyLogger } from './lib/logger/logger.service';

@Module({
  imports: [
    ConfigModule,
    CommonModule,
    UserModule,
    AuthModule,
    LoggerModule,
    ErrorModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  constructor(
    @Inject('DB_SERVICE')
    private readonly dbService: DbService,
    @Inject('REDIS_SERVICE')
    private readonly redisService: RedisService,
    private readonly logger: MyLogger,
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
    this.logger.log(
      `Received signal: ${signal}. Starting graceful shutdown...`,
      'AppModule',
    );
    try {
      await this.dbService.close();
      await this.redisService.close();
    } catch (error) {
      this.logger.error(
        'Error during disconnection',
        error instanceof Error ? error.stack : String(error),
        'AppModule',
      );
    }
  }

  onApplicationShutdown() {
    this.logger.log('Application shutdown complete.');
    this.logger.log('server terminated');
    process.exit(2);
  }
}
