import { Module } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { TransactionController } from './transaction.controller';
import { CommonTransfer } from './transfers/common.transfer';
import { MerchantTransfer } from './transfers/merchant.transfer';
import { LoggingService } from 'src/@common/logger/logger.service';

@Module({
  controllers: [TransactionController],
  providers: [
    LoggingService,
    TransactionService,
    CommonTransfer,
    MerchantTransfer,
  ],
})
export class TransactionModule {}
