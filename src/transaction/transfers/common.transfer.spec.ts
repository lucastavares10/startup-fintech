import { Test, TestingModule } from '@nestjs/testing';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { LoggingService } from 'src/@common/logger/logger.service';
import { IFindUserByAccountIdRepository } from 'src/@domain/interfaces/repositories/user/IFindUserByAccountIdRepository';
import { ICreateTransactionRepository } from 'src/@domain/interfaces/repositories/transaction/ICreateTransactionRepository';
import { User } from 'src/@domain/entities/user.entity';
import { Transaction } from 'src/@domain/entities/transaction.entity';
import { CommonTransfer } from './common.transfer';
import {
  CREATE_TRANSACTION_REPOSITORY,
  FIND_USER_BY_ACCOUNT_ID_REPOSITORY,
} from 'src/@domain/interfaces/repositories/constants';
import { USER_TYPE } from 'src/@domain/enum/USER_TYPE';
import { Account } from 'src/@domain/entities/account.entity';

describe('CommonTransfer', () => {
  let service: CommonTransfer;
  let findUserByAccountIdRepository: IFindUserByAccountIdRepository;
  let createTransactionRepository: ICreateTransactionRepository;
  let cacheManager: Cache;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CommonTransfer,
        {
          provide: CACHE_MANAGER,
          useValue: {
            set: jest.fn(),
          },
        },
        {
          provide: LoggingService,
          useValue: {
            log: jest.fn(),
          },
        },
        {
          provide: FIND_USER_BY_ACCOUNT_ID_REPOSITORY,
          useValue: {
            findByAccountId: jest.fn(),
          },
        },
        {
          provide: CREATE_TRANSACTION_REPOSITORY,
          useValue: {
            create: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<CommonTransfer>(CommonTransfer);
    cacheManager = module.get<Cache>(CACHE_MANAGER);
    findUserByAccountIdRepository = module.get<IFindUserByAccountIdRepository>(
      FIND_USER_BY_ACCOUNT_ID_REPOSITORY,
    );
    createTransactionRepository = module.get<ICreateTransactionRepository>(
      CREATE_TRANSACTION_REPOSITORY,
    );
  });

  it('should throw BadRequestException if payer has insufficient funds', async () => {
    const payer = new User(
      1,
      'Lucas Tavares',
      'freirelts@gmail.com',
      '02135466875',
      USER_TYPE.COMMON,
      null,
      new Account(1, 50),
    );

    const payeeId = 2;
    const value = 150;
    const correlationId = '123456';

    await expect(
      service.handle(payer, payeeId, value, correlationId),
    ).rejects.toThrow(BadRequestException);
  });

  it('should throw NotFoundException if payee is not found', async () => {
    const payer = new User(
      1,
      'Lucas Tavares',
      'freirelts@gmail.com',
      '02135466875',
      USER_TYPE.COMMON,
      null,
      new Account(1, 10000),
    );

    const payeeId = 2;
    const value = 150;
    const correlationId = '123456';

    jest
      .spyOn(findUserByAccountIdRepository, 'findByAccountId')
      .mockResolvedValue(null);

    await expect(
      service.handle(payer, payeeId, value, correlationId),
    ).rejects.toThrow(NotFoundException);
  });

  it('should create transaction and update balances successfully', async () => {
    const correlationId = '123456';

    const payer = new User(
      1,
      'Lucas Tavares',
      'freirelts@gmail.com',
      '02135466875',
      USER_TYPE.COMMON,
      null,
      new Account(1, 10000),
    );

    const payee = new User(
      2,
      'João Silva Tavares',
      'joaosvs@gmail.com',
      '02135466875',
      USER_TYPE.COMMON,
      null,
      new Account(2, 50),
    );

    const transaction = new Transaction(666, 1, 2, 50, new Date());

    jest
      .spyOn(findUserByAccountIdRepository, 'findByAccountId')
      .mockResolvedValue(payee);

    jest
      .spyOn(createTransactionRepository, 'create')
      .mockResolvedValue(transaction);

    const result = await service.handle(payer, payee.id, 50, correlationId);

    expect(result).toEqual(transaction);
    expect(cacheManager.set).toHaveBeenCalled();
  });
});
