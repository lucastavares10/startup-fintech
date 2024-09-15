import {
  Injectable,
  BadRequestException,
  Inject,
  NotFoundException,
} from '@nestjs/common';
import { LoggingService } from 'src/@common/logger/logger.service';
import { Transaction } from 'src/@domain/entities/transaction.entity';
import { User } from 'src/@domain/entities/user.entity';
import { REGISTRY_TYPE } from 'src/@domain/enum/REGISTRY_TYPE';
import { ITransfer } from 'src/@domain/interfaces/ITransfer';
import { ICreateTransactionRepository } from 'src/@domain/interfaces/repositories/transaction/ICreateTransactionRepository';
import { IFindUserByAccountIdRepository } from 'src/@domain/interfaces/repositories/user/IFindUserByAccountIdRepository';

@Injectable()
export class CommonTransfer implements ITransfer {
  constructor(
    private readonly loggingService: LoggingService,
    @Inject('IFindUserByAccountIdRepository')
    private readonly findUserByAccountIdRepository: IFindUserByAccountIdRepository,
    @Inject('ICreateTransactionRepository')
    private readonly createTransactionRepository: ICreateTransactionRepository,
  ) {}

  async handle(
    payer: User,
    payeeId: number,
    value: number,
    correlationId: string,
  ): Promise<Transaction> {
    this.loggingService.log(
      REGISTRY_TYPE.PROCESSING_COMMON_TRANSFER,
      `Entering common transfer process`,
      correlationId,
    );

    if (!payer.hasBalance(value)) {
      this.loggingService.log(
        REGISTRY_TYPE.ENDING_TRANSACTION,
        `Payer with account ${payer.account.id} has insuficient funds in account`,
        correlationId,
      );

      throw new BadRequestException('Insufficient funds');
    }

    const payee =
      await this.findUserByAccountIdRepository.findByAccountId(payeeId);

    if (!payee) {
      this.loggingService.log(
        REGISTRY_TYPE.ENDING_TRANSACTION,
        `Payee with account ${payeeId} to transfer the amount not found`,
        correlationId,
      );

      throw new NotFoundException('Payee account not found');
    }

    const result = await this.createTransactionRepository.create(
      payer,
      payee,
      value,
    );

    this.loggingService.log(
      REGISTRY_TYPE.ENDING_TRANSACTION,
      `Payer with account ${payer.account.id} successfully transfer amount to account ${payee.account.id} in transaction ${result.id}`,
      correlationId,
    );

    return result;
  }
}
