import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { createLogger } from 'winston';
import { WinstonModule } from 'nest-winston';
import { EnvironmentService } from './@common/environment/environment.service';
import { addWinstonLoggerInstance } from './@common/logger/logger.instance';

async function bootstrap() {
  const winstonInstance = createLogger();

  const app = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger({
      instance: winstonInstance,
    }),
  });

  const envService = app.get(EnvironmentService);

  addWinstonLoggerInstance(
    winstonInstance,
    envService.NODE_ENV,
    envService.APP_NAME,
  );

  await app.listen(envService.PORT);
}
bootstrap();
