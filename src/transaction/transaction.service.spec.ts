import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { CommonTransfer } from './transfers/common.transfer';
import { MerchantTransfer } from './transfers/merchant.transfer';
import { LoggingService } from 'src/@common/logger/logger.service';
import { IFindUserByAccountIdRepository } from 'src/@domain/interfaces/repositories/user/IFindUserByAccountIdRepository';
import { TransferDto } from 'src/@domain/dtos/transaction/transfer.dto';
import { USER_TYPE } from 'src/@domain/enum/USER_TYPE';
import { FIND_USER_BY_ACCOUNT_ID_REPOSITORY } from 'src/@domain/interfaces/repositories/constants';
import { User } from 'src/@domain/entities/user.entity';
import { Account } from 'src/@domain/entities/account.entity';
import { Transaction } from 'src/@domain/entities/transaction.entity';

describe('TransactionService', () => {
  let service: TransactionService;
  let findUserByAccountIdRepository: IFindUserByAccountIdRepository;
  let commonTransfer: CommonTransfer;
  let merchantTransfer: MerchantTransfer;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionService,
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
          provide: CommonTransfer,
          useValue: {
            handle: jest.fn(),
          },
        },
        {
          provide: MerchantTransfer,
          useValue: {
            handle: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<TransactionService>(TransactionService);
    findUserByAccountIdRepository = module.get<IFindUserByAccountIdRepository>(
      FIND_USER_BY_ACCOUNT_ID_REPOSITORY,
    );
    commonTransfer = module.get<CommonTransfer>(CommonTransfer);
    merchantTransfer = module.get<MerchantTransfer>(MerchantTransfer);
  });

  it('should throw BadRequestException if payer is not found', async () => {
    jest
      .spyOn(findUserByAccountIdRepository, 'findByAccountId')
      .mockResolvedValue(null);

    const transferDto: TransferDto = {
      payer: 1,
      payee: 2,
      value: 100,
    };

    await expect(service.handle(transferDto, 'correlation-id')).rejects.toThrow(
      new BadRequestException('Payer not found'),
    );
  });

  it('should set transfer type to CommonTransfer for COMMON user type', async () => {
    jest
      .spyOn(findUserByAccountIdRepository, 'findByAccountId')
      .mockResolvedValue(
        new User(
          1,
          'Lucas Tavares',
          'freirelts@gmail.com',
          '02135466875',
          USER_TYPE.COMMON,
          null,
          new Account(1, 200),
        ),
      );

    const transferDto: TransferDto = {
      payer: 1,
      payee: 2,
      value: 100,
    };

    await service.handle(transferDto, 'correlation-id');

    expect(service['transfer']).toBe(commonTransfer);
    expect(commonTransfer.handle).toHaveBeenCalled();
  });

  it('should set transfer type to MerchantTransfer for MERCHANT user type', async () => {
    jest
      .spyOn(findUserByAccountIdRepository, 'findByAccountId')
      .mockResolvedValue(
        new User(
          2,
          'Lucas Tavares',
          'freirelts@gmail.com',
          '02135466875',
          USER_TYPE.MERCHANT,
          null,
          new Account(2, 200),
        ),
      );

    const transferDto: TransferDto = {
      payer: 2,
      payee: 1,
      value: 100,
    };

    await service.handle(transferDto, 'correlation-id');

    expect(service['transfer']).toBe(merchantTransfer);
    expect(merchantTransfer.handle).toHaveBeenCalled();
  });

  it('should return success message when transfer is completed', async () => {
    jest
      .spyOn(findUserByAccountIdRepository, 'findByAccountId')
      .mockResolvedValue(
        new User(
          1,
          'Lucas Tavares',
          'freirelts@gmail.com',
          '02135466875',
          USER_TYPE.COMMON,
          null,
          new Account(1, 200),
        ),
      );
    jest
      .spyOn(commonTransfer, 'handle')
      .mockResolvedValue(new Transaction(666, 1, 2, 200, new Date()));

    const transferDto: TransferDto = {
      payer: 1,
      payee: 2,
      value: 200,
    };

    const result = await service.handle(transferDto, 'correlation-id');

    expect(result.message).toEqual('Transfer completed successfully.');
  });
});
