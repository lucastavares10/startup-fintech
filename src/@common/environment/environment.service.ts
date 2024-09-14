import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';

@Injectable()
export class EnvironmentService {
  constructor(private cs: ConfigService) {}

  readonly APP_NAME = 'fintech-app';
  readonly PORT = this.cs.get<number>('PORT');
  readonly NODE_ENV = this.cs.get<string>('NODE_ENV');
  readonly BCRYPT_PASSWORD = this.cs.get<string>('BCRYPT_PASSWORD');
}
