import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { LoggingService } from 'src/@common/logger/logger.service';
import { User } from 'src/@domain/entities/user.entity';
import { USER_TYPE } from 'src/@domain/enum/USER_TYPE';
import { Account } from 'src/@domain/entities/account.entity';
import { MerchantTransfer } from './merchant.transfer';

describe('MerchantTransfer', () => {
  let service: MerchantTransfer;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MerchantTransfer,
        {
          provide: LoggingService,
          useValue: {
            log: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<MerchantTransfer>(MerchantTransfer);
  });

  it('should throw BadRequestException if payer is merchant', async () => {
    const payer = new User(
      1,
      'Lucas Tavares',
      'freirelts@gmail.com',
      '02135466875',
      USER_TYPE.MERCHANT,
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
});
