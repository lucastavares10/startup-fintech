import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { LoggingService } from 'src/@common/logger/logger.service';
import { HashingService } from 'src/@common/hashing/hashing.service';
import { EnvironmentModule } from 'src/@common/environment/environment.module';
import { EnvironmentService } from 'src/@common/environment/environment.service';
import * as redisStore from 'cache-manager-redis-store';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [
    CacheModule.registerAsync({
      imports: [EnvironmentModule],
      inject: [EnvironmentService],
      useFactory: (envService: EnvironmentService) => ({
        isGlobal: true,
        store: redisStore,
        host: envService.REDIS_HOST,
        port: envService.REDIS_PORT,
        ttl: 60,
        max: 100,
      }),
    }),
  ],
  controllers: [UserController],
  providers: [UserService, LoggingService, HashingService],
})
export class UserModule {}
