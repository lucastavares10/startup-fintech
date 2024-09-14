import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { LoggingService } from 'src/@common/logger/logger.service';
import { HashingService } from 'src/@common/hashing/hashing.service';

@Module({
  controllers: [UserController],
  providers: [UserService, LoggingService, HashingService],
})
export class UserModule {}
