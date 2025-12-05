import { Module } from '@nestjs/common';
import { DbService } from './db.service';
import { ConfigModule } from '../../config/config.module';

export const SEQUELIZE_PROVIDER = {
  provide: 'SEQUELIZE',
  useFactory: (dbService: DbService) => dbService.getSequelize(),
  inject: [DbService],
};

@Module({
  imports: [ConfigModule],
  providers: [DbService, SEQUELIZE_PROVIDER],
  exports: [DbService, SEQUELIZE_PROVIDER],
})
export class DbModule {}
