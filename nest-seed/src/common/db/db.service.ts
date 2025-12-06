import { Injectable } from '@nestjs/common';
import { Sequelize, SequelizeOptions } from 'sequelize-typescript';
import { ConfigService } from '../../config/config.service';
import { ModelList } from './models';

@Injectable()
export class DbService {
  private sequelize: Sequelize;
  constructor(private readonly configService: ConfigService) {}

  async init(): Promise<void> {
    const dbConfig = this.configService.getDbConfig();
    console.log(dbConfig);
    const options: SequelizeOptions = {
      dialect: 'postgres',
      host: dbConfig.host,
      port: dbConfig.port,
      username: dbConfig.username,
      password: dbConfig.password,
      database: dbConfig.database,
      models: ModelList,
      logging: false,
    };

    this.sequelize = new Sequelize(options);

    try {
      await this.sequelize.authenticate();
      console.log('데이터베이스 연결 성공');
    } catch (error) {
      const err = error as Error;
      console.error('Unable to connect to the database:', err.message);
      throw err;
    }
  }

  getSequelize(): Sequelize {
    return this.sequelize;
  }

  async checkHealth() {
    try {
      await this.sequelize.authenticate();
      return { status: 'ok' };
    } catch (error) {
      throw error;
    }
  }
}
