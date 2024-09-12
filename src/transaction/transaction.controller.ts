import { Controller, Post, Body } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { TransferDto } from 'src/@domain/dtos/transaction/transfer.dto';

@Controller('transfer')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Post()
  transfer(@Body() transferDto: TransferDto) {
    return this.transactionService.transfer(transferDto);
  }
}
