import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Api')
@Controller()
export class AppController {
  @Get('/health')
  getHealth(): string {
    return 'OK';
  }
}
