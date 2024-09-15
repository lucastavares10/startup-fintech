import { Module } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { TransactionController } from './transaction.controller';
import { CommonTransfer } from './transfers/common.transfer';
import { MerchantTransfer } from './transfers/merchant.transfer';
import { LoggingService } from 'src/@common/logger/logger.service';
import { CacheModule } from '@nestjs/cache-manager';
import { EnvironmentModule } from 'src/@common/environment/environment.module';
import { EnvironmentService } from 'src/@common/environment/environment.service';
import * as redisStore from 'cache-manager-redis-store';

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
  controllers: [TransactionController],
  providers: [
    LoggingService,
    TransactionService,
    CommonTransfer,
    MerchantTransfer,
  ],
})
export class TransactionModule {}
