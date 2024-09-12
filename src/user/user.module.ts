import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { LoggingService } from 'src/@common/logger/logger.service';

@Module({
  controllers: [UserController],
  providers: [UserService, LoggingService],
})
export class UserModule {}
