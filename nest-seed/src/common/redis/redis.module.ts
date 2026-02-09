import { Module } from '@nestjs/common';
import { RedisService } from './redis.service';
import { ConfigModule } from '../../config/config.module';
import { ConfigService } from '../../config/config.service';
import { MyLogger } from 'src/lib/logger/logger.service';

@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: 'REDIS_SERVICE',
      inject: [ConfigService, MyLogger],
      useFactory: (configService: ConfigService, logger: MyLogger) => {
        return new RedisService(configService, logger);
      },
    },
  ],
  exports: ['REDIS_SERVICE'],
})
export class RedisModule {}
