import { Injectable } from '@nestjs/common';
import { TransferDto } from 'src/@domain/dtos/transaction/transfer.dto';
import { TransactionRepository } from 'src/@infra/prisma/repositories/transactions.repository';

@Injectable()
export class TransactionService {
  constructor(private readonly transactionRepository: TransactionRepository) {}

  async transfer(transferDto: TransferDto) {
    return await this.transactionRepository.create({
      payeeId: transferDto.payee,
      payerId: transferDto.payer,
      value: transferDto.value,
    });
  }
}
