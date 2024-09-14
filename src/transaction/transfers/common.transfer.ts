import { Injectable, BadRequestException, Inject } from '@nestjs/common';
import { Transaction } from 'src/@domain/entities/transaction.entity';
import { User } from 'src/@domain/entities/user.entity';
import { ITransfer } from 'src/@domain/interfaces/ITransfer';
import { ICreateTransactionRepository } from 'src/@domain/interfaces/repositories/transaction/ICreateTransactionRepository';
import { IFindUserByAccountIdRepository } from 'src/@domain/interfaces/repositories/user/IFindUserByAccountIdRepository';

@Injectable()
export class CommonTransfer implements ITransfer {
  constructor(
    @Inject('IFindUserByAccountIdRepository')
    private readonly findUserByAccountIdRepository: IFindUserByAccountIdRepository,
    @Inject('ICreateTransactionRepository')
    private readonly createTransactionRepository: ICreateTransactionRepository,
  ) {}

  async handle(
    payer: User,
    payeeId: number,
    value: number,
  ): Promise<Transaction | void> {
    if (!payer.isCommon()) {
      throw new BadRequestException(
        'Only common users can initiate transfers at the moment',
      );
    }

    if (!payer.hasBalance(value)) {
      throw new BadRequestException('Insufficient funds');
    }

    const payee =
      await this.findUserByAccountIdRepository.findByAccountId(payeeId);

    return await this.createTransactionRepository.create(payer, payee, value);
  }
}
