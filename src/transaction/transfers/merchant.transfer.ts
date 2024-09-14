import { Injectable, BadRequestException } from '@nestjs/common';
import { Transaction } from 'src/@domain/entities/transaction.entity';
import { User } from 'src/@domain/entities/user.entity';
import { ITransfer } from 'src/@domain/interfaces/ITransfer';

@Injectable()
export class MerchantTransfer implements ITransfer {
  constructor() {}

  async handle(
    payer: User,
    payeeId: number,
    value: number,
  ): Promise<Transaction | void> {
    if (payer.isMerchant()) {
      throw new BadRequestException(
        'Merchants cannot initiate transfers at the moment',
      );
    }
  }
}
