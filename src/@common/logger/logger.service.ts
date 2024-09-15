import { Injectable, Logger } from '@nestjs/common';
import { REGISTRY_TYPE } from 'src/@domain/enum/REGISTRY_TYPE';

@Injectable()
export class LoggingService {
  private readonly logger = new Logger(LoggingService.name);

  log(type: REGISTRY_TYPE, message: string, correlationId?: string): void {
    this.logger.log({
      type,
      message,
      correlationId,
    });
  }

  error(type: REGISTRY_TYPE, message: string, correlationId?: string): void {
    this.logger.error({
      type,
      message,
      correlationId,
    });
  }
}
