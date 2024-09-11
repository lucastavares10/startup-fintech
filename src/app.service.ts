import { Injectable } from '@nestjs/common';
import { REGISTRY_TYPE } from './@common/constants';
import { LoggingService } from './@common/logger/logger.service';

@Injectable()
export class AppService {
  constructor(private readonly loggingService: LoggingService) {}

  getHello(): string {
    this.loggingService.log(
      REGISTRY_TYPE.CREATE_USER,
      'User created successfully!',
      '1111',
    );

    return 'Hello World!!!';
  }
}
