import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { AddBalanceDto } from 'src/@domain/dtos/account/add-balance.dto';
import { IIncreaseBalanceRepository } from 'src/@domain/interfaces/repositories/account/IIncreaseBalanceRepository';

@Injectable()
export class AccountService {
  constructor(
    @Inject('IIncreaseBalanceRepository')
    private readonly increaseBalanceRepository: IIncreaseBalanceRepository,
  ) {}

  async addAccountBalance(accountId: number, addBalanceDto: AddBalanceDto) {
    try {
      return await this.increaseBalanceRepository.increaseBalance(
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
