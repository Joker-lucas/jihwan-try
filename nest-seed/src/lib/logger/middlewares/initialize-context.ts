import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { randomUUID } from 'crypto';
import { loggerStorage } from '../context';

@Injectable()
export class InitContext implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const requestContext = new Map<string, any>();

    loggerStorage.run(requestContext, () => {
      requestContext.set('traceId', randomUUID());

      res.on('finish', () => {
        requestContext.clear();
      });

      next();
    });
  }
}
