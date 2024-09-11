import { Injectable, Logger } from '@nestjs/common';
import { REGISTRY_TYPE } from '../constants';

@Injectable()
export class LoggingService {
  private readonly logger = new Logger(LoggingService.name);

  log(type: REGISTRY_TYPE, message: string, userId: string): void {
    this.logger.log({
      type,
      message,
      userId,
    });
  }

  error(
    type: REGISTRY_TYPE,
    message: string,
    userId: string,
    error?: any,
  ): void {
    this.logger.error({
      type,
      message,
      userId,
      error,
    });
  }
}
