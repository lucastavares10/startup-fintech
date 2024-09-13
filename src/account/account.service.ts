import { Injectable, NotFoundException } from '@nestjs/common';
import { AddBalanceDto } from 'src/@domain/dtos/account/add-balance.dto';
import { AccountRepository } from 'src/@infra/prisma/repositories/account.repository';

@Injectable()
export class AccountService {
  constructor(private readonly accountRepository: AccountRepository) {}

  async addAccountBalance(accountId: number, addBalanceDto: AddBalanceDto) {
    try {
      return await this.accountRepository.increaseBalance(
        accountId,
        addBalanceDto.value,
      );
    } catch (error) {
      if (error.message === 'Account not found') {
        throw new NotFoundException(`Account with ID ${accountId} not found`);
      }
      throw error;
    }
  }
}
