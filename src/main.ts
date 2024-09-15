import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { createLogger } from 'winston';
import { WinstonModule } from 'nest-winston';
import { EnvironmentService } from './@common/environment/environment.service';
import { addWinstonLoggerInstance } from './@common/logger/logger.instance';
import { ValidationPipe } from '@nestjs/common';
import { CorrelationIdMiddleware } from './middleware/correlation-id.middleware';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

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

  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  app.use(new CorrelationIdMiddleware().use);

  const config = new DocumentBuilder()
    .setTitle('Fintech Startup')
    .setDescription('The Fintech Startup API description')
    .setVersion('1.0')
    .addTag('Usuários')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  await app.listen(envService.PORT);
}
bootstrap();
