import { Module, NestModule, MiddlewareConsumer, Global } from '@nestjs/common';
import { MyLogger } from './logger.service';
import { InitContext } from './middlewares/initialize-context';

@Global()
@Module({
  providers: [MyLogger],
  exports: [MyLogger],
})
export class LoggerModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(InitContext).forRoutes('*');
  }
}
