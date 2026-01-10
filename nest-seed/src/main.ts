import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { RedisService } from './common/redis/redis.service';
import { ConfigService } from './config/config.service';
import session from 'express-session';
const RedisStore = require('connect-redis')(session);

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableShutdownHooks();
  const redisService = app.get<RedisService>('REDIS_SERVICE');
  await redisService.init();

  const configService = app.get(ConfigService);

  const redisStore = new RedisStore({
    client: redisService.getClient(),
    ttl: 3600,
    disableTouch: true,
    serializer: JSON,
  });

  app.use(
    session({
      store: redisStore,
      name: 'sssssssssid',
      secret: configService.getSessionSecret(),
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 60 * 60 * 1000,
        httpOnly: true,
      },
    }),
  );

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
