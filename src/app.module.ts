import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EnvironmentModule } from './@common/environment/environment.module';
import { LoggingService } from './@common/logger/logger.service';

@Module({
  imports: [EnvironmentModule],
  controllers: [AppController],
  providers: [AppService, LoggingService],
})
export class AppModule {}
