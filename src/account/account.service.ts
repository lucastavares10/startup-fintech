import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { LoggingService } from 'src/@common/logger/logger.service';
import { AddBalanceDto } from 'src/@domain/dtos/account/add-balance.dto';
import { REGISTRY_TYPE } from 'src/@domain/enum/REGISTRY_TYPE';
import { IGetBalanceRepository } from 'src/@domain/interfaces/repositories/account/IGetBalanceRepository';
import { IIncreaseBalanceRepository } from 'src/@domain/interfaces/repositories/account/IIncreaseBalanceRepository';

@Injectable()
export class AccountService {
  constructor(
    private readonly loggingService: LoggingService,
    @Inject('IIncreaseBalanceRepository')
    private readonly increaseBalanceRepository: IIncreaseBalanceRepository,
    @Inject('IGetBalanceRepository')
    private readonly getBalanceRepository: IGetBalanceRepository,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  async addAccountBalance(
    accountId: number,
    addBalanceDto: AddBalanceDto,
    correlationId: string,
  ) {
    try {
      const balanceDto = await this.increaseBalanceRepository.increaseBalance(
        accountId,
        addBalanceDto.value,
      );

      await this.cacheManager.set(`balance_${accountId}`, balanceDto);

      this.loggingService.log(
        REGISTRY_TYPE.ADD_BALANCE,
        `amount value ${addBalanceDto.value} added to account ${accountId}`,
        correlationId,
      );

      return balanceDto;
    } catch (error) {
      this.loggingService.error(
        REGISTRY_TYPE.ERROR,
        `failed to add amount value to account ${accountId}: ${error.message}`,
        correlationId,
      );

      if (error.message === 'Account not found') {
        throw new NotFoundException(`Account with ID ${accountId} not found`);
      }
      throw error;
    }
  }

  async getAccountBalance(accountId: number, correlationId: string) {
    try {
      const cachedBalance = await this.cacheManager.get(`balance_${accountId}`);

      if (cachedBalance) {
        this.loggingService.log(
          REGISTRY_TYPE.GET_BALANCE,
          `User with account ${accountId} requested balance (Cached)`,
          correlationId,
        );

        return cachedBalance;
      }

      const balanceDto = await this.getBalanceRepository.getBalance(accountId);

      await this.cacheManager.set(`balance_${accountId}`, balanceDto);

      this.loggingService.log(
        REGISTRY_TYPE.GET_BALANCE,
        `User with account ${accountId} requested balance`,
        correlationId,
      );

      return balanceDto;
    } catch (error) {
      this.loggingService.error(
        REGISTRY_TYPE.ERROR,
        `failed to request balance from Account with ID ${accountId}: ${error.message}`,
        correlationId,
      );

      if (error.message === 'Account not found') {
        throw new NotFoundException(`Account with ID ${accountId} not found`);
      }
      throw error;
    }
  }
}
