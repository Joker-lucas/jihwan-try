import { Injectable, LoggerService } from '@nestjs/common';
import pino from 'pino';
import { getContext } from './context';

@Injectable()
export class MyLogger implements LoggerService {
  private readonly logger = pino({
    level: 'info',
    mixin: () => {
      return {
        traceId: getContext<string>('traceId'),
        user: getContext<any>('user'),
      };
    },
  });

  log(message: any, context?: string) {
    const prefix = context ? `[${context}] ` : '';

    if (typeof message === 'object') {
      this.logger.info(message, prefix);
    } else {
      this.logger.info(`${prefix}${message}`);
    }
  }

  error(message: any, trace?: string, context?: string) {
    const prefix = context ? `[${context}] ` : '';

    this.logger.error({ err: trace }, `${prefix}${message}`);
  }

  warn(message: any, context?: string) {
    const prefix = context ? `[${context}] ` : '';
    this.logger.warn(`${prefix}${message}`);
  }

  debug(message: any, context?: string) {
    const prefix = context ? `[${context}] ` : '';
    this.logger.debug(`${prefix}${message}`);
  }
}
