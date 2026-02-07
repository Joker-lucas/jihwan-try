import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { MyLogger } from '../logger.service';
import { setContext } from '../context';

interface RequestWithUser extends Request {
  user?: {
    userId: string;
    name: string;
  };
}

@Injectable()
export class LoggerInterceptor implements NestInterceptor {
  constructor(private readonly logger: MyLogger) {}
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const { method, url } = request;
    const user = request.user;
    if (user) {
      setContext('user', {
        userId: user.userId,
        name: user.name,
      });
    }
    const startTime = Date.now();

    this.logger.log(`요청 시작: ${method} ${url}`, 'Request');

    return next.handle().pipe(
      tap({
        next: () => {
          const delay = Date.now() - startTime;
          this.logger.log(
            `[완료] ${method} ${url} , delayTime: ${delay}`,
            'Response',
          );
        },

        error: (err) => {
          const delay = Date.now() - startTime;

          if (err instanceof Error) {
            this.logger.error(
              `[실패] ${method} ${url} , delayTime: ${delay} - ${err.message}`,
              err.stack,
              'ResponseError',
            );
          } else {
            this.logger.error(
              `[실패] ${method} ${url} , delayTime: ${delay} - 알 수 없는 에러 발생`,
              String(err),
              'ResponseError',
            );
          }
        },
      }),
    );
  }
}
