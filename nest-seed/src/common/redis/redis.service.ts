import { Injectable } from '@nestjs/common';
import { ConfigService } from '../../config/config.service';
import { MyLogger } from 'src/lib/logger/logger.service';
import Redis, { RedisOptions } from 'ioredis';

@Injectable()
export class RedisService {
  private client: Redis;

  constructor(
    private readonly configService: ConfigService,
    private readonly logger: MyLogger,
  ) {}

  async init(): Promise<void> {
    const redisConfig = this.configService.getRedisConfig();

    const options: RedisOptions = {
      host: redisConfig.host,
      port: redisConfig.port,
    };

    this.client = new Redis(options);

    try {
      this.client.on('error', (err) => {
        this.logger.error('Redis 연결 중 오류 발생:', err.message);
      });

      await this.client.ping();
      this.logger.log('Redis 연결 성공');
    } catch (error) {
      const err = error as Error;
      this.logger.error('Unable to connect to Redis:', err.message);
      throw err;
    }
  }
  getClient(): Redis {
    return this.client;
  }

  async close() {
    await this.client.quit();
    this.logger.log('\nRedis Connection closed');
  }
}
