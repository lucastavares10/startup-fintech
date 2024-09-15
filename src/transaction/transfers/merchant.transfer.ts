import { Injectable, BadRequestException } from '@nestjs/common';
import { LoggingService } from 'src/@common/logger/logger.service';
import { Transaction } from 'src/@domain/entities/transaction.entity';
import { User } from 'src/@domain/entities/user.entity';
import { REGISTRY_TYPE } from 'src/@domain/enum/REGISTRY_TYPE';
import { ITransfer } from 'src/@domain/interfaces/ITransfer';

@Injectable()
export class MerchantTransfer implements ITransfer {
  constructor(private readonly loggingService: LoggingService) {}

  async handle(
    payer: User,
    payeeId: number,
    value: number,
  ): Promise<Transaction> {
    this.loggingService.log(
      REGISTRY_TYPE.PROCESSING_MERCHANT_TRANSFER,
      `Entering merchant transfer process`,
      String(payer.account.id),
    );

    if (payer.isMerchant()) {
      this.loggingService.log(
        REGISTRY_TYPE.ENDING_TRANSACTION,
        `Payer with account ${payer.account.id} is a merchant and cannot proccess transfers`,
        String(payer.account.id),
      );

      throw new BadRequestException(
        'Merchants cannot initiate transfers at the moment',
      );
    }

    return new Transaction();
  }
}
