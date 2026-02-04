import { Module, NestModule, MiddlewareConsumer, Global } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { MyLogger } from './logger.service';
import { LoggerInterceptor } from './interceptors';
import { InitContext } from './middlewares/initialize-context';

@Global()
@Module({
  providers: [
    MyLogger,
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggerInterceptor,
    },
  ],
  exports: [MyLogger],
})
export class LoggerModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(InitContext).forRoutes('*');
  }
}
