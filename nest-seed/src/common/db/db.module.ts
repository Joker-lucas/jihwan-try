import { Module } from '@nestjs/common';
import { DbService } from './db.service';
import { ConfigService } from '../../config/config.service';
import { ConfigModule } from '../../config/config.module';
import { ModelsModule } from './models/models.module';
@Module({
  imports: [ConfigModule, ModelsModule],
  providers: [
    {
      provide: 'DB_SERVICE',
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return new DbService(configService);
      },
    },
  ],
  exports: ['DB_SERVICE', ModelsModule],
})
export class DbModule {}
