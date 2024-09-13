import { Injectable, BadRequestException } from '@nestjs/common';
import { User } from 'src/@domain/entities/user.entity';
import { ITransfer } from 'src/@domain/interfaces/ITransfer';

@Injectable()
export class MerchantTransfer implements ITransfer {
  constructor() {}

  async handle(payer: User, payeeId: number, value: number): Promise<void> {
    if (payer.isMerchant()) {
      throw new BadRequestException(
        'Merchants cannot initiate transfers at the moment',
      );
    }
  }
}
