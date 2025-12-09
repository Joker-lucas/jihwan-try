import { Module } from '@nestjs/common';
import { RedisService } from './redis.service';
import { ConfigModule } from '../../config/config.module';
import { ConfigService } from '../../config/config.service';

@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: 'REDIS_SERVICE',
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return new RedisService(configService);
      },
    },
  ],
  exports: ['REDIS_SERVICE'],
})
export class RedisModule {}
