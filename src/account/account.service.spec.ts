import { Test, TestingModule } from '@nestjs/testing';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { NotFoundException } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { AccountService } from './account.service';
import { LoggingService } from 'src/@common/logger/logger.service';
import { IIncreaseBalanceRepository } from 'src/@domain/interfaces/repositories/account/IIncreaseBalanceRepository';
import { IGetBalanceRepository } from 'src/@domain/interfaces/repositories/account/IGetBalanceRepository';
import {
  GET_BALANCE_ACCOUNT_REPOSITORY,
  INCREASE_BALANCE_ACCOUNT_REPOSITORY,
} from 'src/@domain/interfaces/repositories/constants';
import { AddBalanceDto } from 'src/@domain/dtos/account/add-balance.dto';

describe('AccountService', () => {
  let service: AccountService;
  let increaseBalanceRepository: IIncreaseBalanceRepository;
  let getBalanceRepository: IGetBalanceRepository;
  let cacheManager: Cache;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AccountService,
        {
          provide: LoggingService,
          useValue: {
            log: jest.fn(),
            error: jest.fn(),
          },
        },
        {
          provide: INCREASE_BALANCE_ACCOUNT_REPOSITORY,
          useValue: {
            increaseBalance: jest.fn(),
          },
        },
        {
          provide: GET_BALANCE_ACCOUNT_REPOSITORY,
          useValue: {
            getBalance: jest.fn(),
          },
        },
        {
          provide: CACHE_MANAGER,
          useValue: {
            get: jest.fn(),
            set: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AccountService>(AccountService);
    increaseBalanceRepository = module.get<IIncreaseBalanceRepository>(
      INCREASE_BALANCE_ACCOUNT_REPOSITORY,
    );
    getBalanceRepository = module.get<IGetBalanceRepository>(
      GET_BALANCE_ACCOUNT_REPOSITORY,
    );
    cacheManager = module.get<Cache>(CACHE_MANAGER);
  });

  describe('addAccountBalance', () => {
    it('should add balance and cache the result', async () => {
      const accountId = 1;
      const addBalanceDto: AddBalanceDto = { value: 100 };
      const correlationId = 'correlation-id';
      const balanceResult = { accountId, balance: 200 };

      jest
        .spyOn(increaseBalanceRepository, 'increaseBalance')
        .mockResolvedValue(balanceResult);

      const result = await service.addAccountBalance(
        accountId,
        addBalanceDto,
        correlationId,
      );

      expect(result).toEqual(balanceResult);
      expect(increaseBalanceRepository.increaseBalance).toHaveBeenCalledWith(
        accountId,
        addBalanceDto.value,
      );
      expect(cacheManager.set).toHaveBeenCalledWith(
        `balance_${accountId}`,
        balanceResult,
      );
    });

    it('should throw NotFoundException if account is not found', async () => {
      const accountId = 1;
      const addBalanceDto: AddBalanceDto = { value: 100 };
      const correlationId = 'correlation-id';

      jest
        .spyOn(increaseBalanceRepository, 'increaseBalance')
        .mockRejectedValue(new Error('Account not found'));

      await expect(
        service.addAccountBalance(accountId, addBalanceDto, correlationId),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('getAccountBalance', () => {
    it('should return cached balance if exists', async () => {
      const accountId = 1;
      const correlationId = 'correlation-id';
      const cachedBalance = { balance: 150 };

      jest.spyOn(cacheManager, 'get').mockResolvedValue(cachedBalance);

      const result = await service.getAccountBalance(accountId, correlationId);

      expect(result).toEqual(cachedBalance);
      expect(cacheManager.get).toHaveBeenCalledWith(`balance_${accountId}`);
    });

    it('should fetch balance from repository if not cached', async () => {
      const accountId = 1;
      const correlationId = 'correlation-id';
      const balanceResult = { accountId, balance: 200 };

      jest.spyOn(cacheManager, 'get').mockResolvedValue(null);
      jest
        .spyOn(getBalanceRepository, 'getBalance')
        .mockResolvedValue(balanceResult);

      const result = await service.getAccountBalance(accountId, correlationId);

      expect(result).toEqual(balanceResult);
      expect(cacheManager.get).toHaveBeenCalledWith(`balance_${accountId}`);
      expect(getBalanceRepository.getBalance).toHaveBeenCalledWith(accountId);
      expect(cacheManager.set).toHaveBeenCalledWith(
        `balance_${accountId}`,
        balanceResult,
      );
    });

    it('should throw NotFoundException if account is not found', async () => {
      const accountId = 1;
      const correlationId = 'correlation-id';

      jest.spyOn(cacheManager, 'get').mockResolvedValue(null);
      jest
        .spyOn(getBalanceRepository, 'getBalance')
        .mockRejectedValue(new Error('Account not found'));

      await expect(
        service.getAccountBalance(accountId, correlationId),
      ).rejects.toThrow(NotFoundException);
    });
  });
});
