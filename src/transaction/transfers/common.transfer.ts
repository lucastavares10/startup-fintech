import { Injectable, BadRequestException } from '@nestjs/common';
import { User } from 'src/@domain/entities/user.entity';
import { ITransfer } from 'src/@domain/interfaces/ITransfer';
import { AccountRepository } from 'src/@infra/prisma/repositories/account.repository';
import { UserRepository } from 'src/@infra/prisma/repositories/user.repository';

@Injectable()
export class CommonTransfer implements ITransfer {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly accountRepository: AccountRepository,
  ) {}

  async handle(payer: User, payeeId: number, value: number): Promise<void> {
    if (!payer.hasBalance(value)) {
      throw new BadRequestException('Insufficient funds');
    }

    const payee = await this.userRepository.findByAccountId(payeeId);

    await this.accountRepository.decreaseBalance(payer.account.id, value);
    await this.accountRepository.increaseBalance(payee.account.id, value);
  }
}
