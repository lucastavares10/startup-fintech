import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { TransferDto } from 'src/@domain/dtos/transaction/transfer.dto';
import { ITransfer } from 'src/@domain/interfaces/ITransfer';
import { CommonTransfer } from './transfers/common.transfer';
import { MerchantTransfer } from './transfers/merchant.transfer';
import { USER_TYPE } from 'src/@domain/enum/USER_TYPE';
import { LoggingService } from 'src/@common/logger/logger.service';
import { IFindUserByAccountIdRepository } from 'src/@domain/interfaces/repositories/user/IFindUserByAccountIdRepository';
import { REGISTRY_TYPE } from 'src/@domain/enum/REGISTRY_TYPE';
import { FIND_USER_BY_ACCOUNT_ID_REPOSITORY } from 'src/@domain/interfaces/repositories/constants';

@Injectable()
export class TransactionService {
  private transfer: ITransfer;

  constructor(
    private readonly loggingService: LoggingService,
    @Inject(FIND_USER_BY_ACCOUNT_ID_REPOSITORY)
    private readonly findUserByAccountIdRepository: IFindUserByAccountIdRepository,
    private readonly commonTransfer: CommonTransfer,
    private readonly merchantTransfer: MerchantTransfer,
  ) {}

  async handle(transferDto: TransferDto, correlationId: string) {
    this.loggingService.log(
      REGISTRY_TYPE.BEGIN_TRANSACTION,
      `Payer with account ${transferDto.payer} initiate transfer to payee with account ${transferDto.payee}`,
      correlationId,
    );

    const payer = await this.findUserByAccountIdRepository.findByAccountId(
      transferDto.payer,
    );

    if (!payer) {
      this.loggingService.log(
        REGISTRY_TYPE.ENDING_TRANSACTION,
        `Payer with account ${transferDto.payer} not found`,
        correlationId,
      );

      throw new BadRequestException('Payer not found');
    }

    this.setTransferType(payer.type);

    const transaction = await this.transfer.handle(
      payer,
      transferDto.payee,
      transferDto.value,
      correlationId,
    );

    return { message: `Transfer completed successfully.`, data: transaction };
  }

  setTransferType(userType: USER_TYPE) {
    switch (userType) {
      case USER_TYPE.COMMON:
        this.transfer = this.commonTransfer;
        break;
      case USER_TYPE.MERCHANT:
        this.transfer = this.merchantTransfer;
        break;
      default:
        throw new BadRequestException('Invalid user type');
    }
  }
}
