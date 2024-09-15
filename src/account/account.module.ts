import { Module } from '@nestjs/common';
import { AccountService } from './account.service';
import { AccountController } from './account.controller';
import { LoggingService } from 'src/@common/logger/logger.service';

@Module({
  controllers: [AccountController],
  providers: [AccountService, LoggingService],
})
export class AccountModule {}
