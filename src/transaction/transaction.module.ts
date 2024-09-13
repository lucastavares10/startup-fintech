import { Module } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { TransactionController } from './transaction.controller';
import { CommonTransfer } from './transfers/common.transfer';
import { MerchantTransfer } from './transfers/merchant.transfer';

@Module({
  controllers: [TransactionController],
  providers: [TransactionService, CommonTransfer, MerchantTransfer],
})
export class TransactionModule {}
