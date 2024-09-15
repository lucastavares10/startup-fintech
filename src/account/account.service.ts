import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { LoggingService } from 'src/@common/logger/logger.service';
import { AddBalanceDto } from 'src/@domain/dtos/account/add-balance.dto';
import { REGISTRY_TYPE } from 'src/@domain/enum/REGISTRY_TYPE';
import { IIncreaseBalanceRepository } from 'src/@domain/interfaces/repositories/account/IIncreaseBalanceRepository';

@Injectable()
export class AccountService {
  constructor(
    private readonly loggingService: LoggingService,
    @Inject('IIncreaseBalanceRepository')
    private readonly increaseBalanceRepository: IIncreaseBalanceRepository,
  ) {}

  async addAccountBalance(accountId: number, addBalanceDto: AddBalanceDto) {
    try {
      const balanceDto = await this.increaseBalanceRepository.increaseBalance(
        accountId,
        addBalanceDto.value,
      );

      this.loggingService.log(
        REGISTRY_TYPE.ADD_BALANCE,
        `amount value ${addBalanceDto.value} added to account ${accountId}`,
      );

      return balanceDto;
    } catch (error) {
      this.loggingService.error(
        REGISTRY_TYPE.ERROR,
        `failed to add amount value to account ${accountId}: ${error.message}`,
        null,
      );

      if (error.message === 'Account not found') {
        throw new NotFoundException(`Account with ID ${accountId} not found`);
      }
      throw error;
    }
  }
}
