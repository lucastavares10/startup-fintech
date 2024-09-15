import { CACHE_MANAGER } from '@nestjs/cache-manager';
import {
  Injectable,
  BadRequestException,
  Inject,
  NotFoundException,
} from '@nestjs/common';
import { Cache } from 'cache-manager';
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
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
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

    payer.account.balance -= value;
    payee.account.balance += value;

    await this.cacheManager.set(`user_${payer.id}`, payer);

    await this.cacheManager.set(`user_${payee.id}`, payee);

    await this.cacheManager.set(`balance_${payer.account.id}`, {
      accountId: payer.account.id,
      balance: payer.account.balance,
    });

    await this.cacheManager.set(`balance_${payee.account.id}`, {
      accountId: payee.account.id,
      balance: payee.account.balance,
    });

    this.loggingService.log(
      REGISTRY_TYPE.ENDING_TRANSACTION,
      `Payer with account ${payer.account.id} successfully transfer amount to account ${payee.account.id} in transaction ${result.id}`,
      correlationId,
    );

    return result;
  }
}
