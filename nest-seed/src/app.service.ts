import { Inject, Injectable } from '@nestjs/common';
import { DbService } from './common/db/db.service';

@Injectable()
export class AppService {
  constructor(@Inject('DB_SERVICE') private readonly dbService: DbService) {}
  getHello(): string {
    return 'Hello World!';
  }

  async checkDbHealth() {
    try {
      return await this.dbService.checkHealth();
    } catch (error) {
      const err = error as Error;
      return { status: 'error', details: err.message };
    }
  }
}
