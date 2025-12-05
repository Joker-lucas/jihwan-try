import { Injectable } from '@nestjs/common';
import { ConfigService as NestConfigService } from '@nestjs/config';

export interface DbConfig {
  host: string;
  port: number;
  database: string;
  username: string;
  password: string;
}

export interface RedisConfig {
  host: string;
  port: number;
}

@Injectable()
export class ConfigService {
  constructor(private readonly config: NestConfigService) {}

  getServerPort(): number {
    const port = parseInt(this.config.get<string>('PORT') || '3000');
    return port;
  }

  getDbConfig(): DbConfig {
    return {
      host: this.config.get<string>('DB_HOST') || 'localhost',
      port: parseInt(this.config.get<string>('DB_PORT') || '5432'),
      database: this.config.get<string>('DB_DATABASENAME') || 'mydb',
      username: this.config.get<string>('DB_USERNAME') || 'user',
      password: this.config.get<string>('DB_PASSWORD') || 'password',
    };
  }

  getRedisConfig(): RedisConfig {
    return {
      host: this.config.get<string>('REDIS_HOST') || 'localhost',
      port: parseInt(this.config.get<string>('REDIS_PORT') || '6379'),
    };
  }
}
