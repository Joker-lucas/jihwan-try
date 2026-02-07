import { Module } from '@nestjs/common';
import { DbService } from './db.service';
import { ConfigService } from '../../config/config.service';
import { ConfigModule } from '../../config/config.module';
import { ModelsModule } from './models/models.module';
import { MyLogger } from 'src/lib/logger/logger.service';
@Module({
  imports: [ConfigModule, ModelsModule],
  providers: [
    {
      provide: 'DB_SERVICE',
      inject: [ConfigService, MyLogger],
      useFactory: (configService: ConfigService, logger: MyLogger) => {
        return new DbService(configService, logger);
      },
    },
  ],
  exports: ['DB_SERVICE', ModelsModule],
})
export class DbModule {}
