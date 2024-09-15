import { Controller, Post, Body, HttpCode, Headers } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { TransferDto } from 'src/@domain/dtos/transaction/transfer.dto';

@Controller('transfer')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Post()
  @HttpCode(200)
  async transfer(
    @Body() transferDto: TransferDto,
    @Headers('x-correlation-id') correlationId: string,
  ) {
    return await this.transactionService.handle(transferDto, correlationId);
  }
}
