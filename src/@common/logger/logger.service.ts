import { Injectable, Logger } from '@nestjs/common';
import { REGISTRY_TYPE } from 'src/@domain/enum/REGISTRY_TYPE';

@Injectable()
export class LoggingService {
  private readonly logger = new Logger(LoggingService.name);

  log(type: REGISTRY_TYPE, message: string, accountId?: string): void {
    this.logger.log({
      type,
      message,
      accountId,
    });
  }

  error(type: REGISTRY_TYPE, message: string, accountId?: string): void {
    this.logger.error({
      type,
      message,
      accountId,
    });
  }
}
