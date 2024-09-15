import { Test, TestingModule } from '@nestjs/testing';
import { TransactionController } from './transaction.controller';
import { TransactionService } from './transaction.service';
import { FIND_USER_BY_ACCOUNT_ID_REPOSITORY } from 'src/@domain/interfaces/repositories/constants';
import { LoggingService } from 'src/@common/logger/logger.service';
import { CommonTransfer } from './transfers/common.transfer';
import { MerchantTransfer } from './transfers/merchant.transfer';
import { Transaction } from 'src/@domain/entities/transaction.entity';

describe('TransactionController', () => {
  let controller: TransactionController;
  let service: TransactionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransactionController],
      providers: [
        TransactionService,
        {
          provide: LoggingService,
          useValue: {
            log: jest.fn,
            error: jest.fn,
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

    controller = module.get<TransactionController>(TransactionController);
    service = module.get<TransactionService>(TransactionService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('transfer', () => {
    it('should transaction result successfully', async () => {
      const transferDto = { payer: 1, payee: 2, value: 50 };
      const correlationId = '123456';

      const transaction = new Transaction(666, 1, 2, 200, new Date());

      const result = {
        message: 'Transfer completed successfully.',
        data: transaction,
      };

      jest
        .spyOn(service, 'handle')
        .mockImplementation(
          async () => new Promise((resolve) => resolve(result)),
        );

      expect(await controller.transfer(transferDto, correlationId)).toBe(
        result,
      );
    });
  });
});
