import { BadRequestException, Injectable } from '@nestjs/common';
import { TransferDto } from 'src/@domain/dtos/transaction/transfer.dto';
import { ITransfer } from 'src/@domain/interfaces/ITransfer';
import { UserRepository } from 'src/@infra/prisma/repositories/user.repository';
import { CommonTransfer } from './transfers/common.transfer';
import { MerchantTransfer } from './transfers/merchant.transfer';
import { USER_TYPE } from 'src/@domain/enum/USER_TYPE';

@Injectable()
export class TransactionService {
  private transfer: ITransfer;

  constructor(
    private readonly userRepository: UserRepository,
    private readonly commonTransfer: CommonTransfer,
    private readonly merchantTransfer: MerchantTransfer,
  ) {}

  async handle(transferDto: TransferDto) {
    const payer = await this.userRepository.findByAccountId(transferDto.payer);

    if (!payer) {
      throw new BadRequestException('Payer not found');
    }

    this.setTransferType(payer.type);

    const transaction = await this.transfer.handle(
      payer,
      transferDto.payee,
      transferDto.value,
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
