import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';

@Injectable()
export class EnvironmentService {
  constructor(private cs: ConfigService) {}

  readonly APP_NAME = 'fintech-app';
  readonly PORT = this.cs.get<number>('PORT');
  readonly NODE_ENV = this.cs.get<string>('NODE_ENV');
  readonly REDIS_HOST = this.cs.get<string>('REDIS_HOST');
  readonly REDIS_PORT = this.cs.get<number>('REDIS_PORT');
}
