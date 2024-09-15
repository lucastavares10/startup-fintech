import { Test, TestingModule } from '@nestjs/testing';
import { AccountController } from './account.controller';
import { AccountService } from './account.service';
import { BadRequestException } from '@nestjs/common';
import { AddBalanceDto } from 'src/@domain/dtos/account/add-balance.dto';

describe('AccountController', () => {
  let controller: AccountController;
  let service: AccountService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AccountController],
      providers: [
        {
          provide: AccountService,
          useValue: {
            addAccountBalance: jest.fn(),
            getAccountBalance: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AccountController>(AccountController);
    service = module.get<AccountService>(AccountService);
  });

  describe('addBalance', () => {
    it('should add balance to account successfully', async () => {
      const accountId = '1';
      const addBalanceDto: AddBalanceDto = { value: 100 };
      const correlationId = '123456';

      jest.spyOn(service, 'addAccountBalance').mockResolvedValue({
        accountId: 1,
        balance: 200,
      });

      const result = await controller.addBalance(
        accountId,
        addBalanceDto,
        correlationId,
      );

      expect(result).toEqual({
        accountId: 1,
        balance: 200,
      });
    });

    it('should throw BadRequestException for invalid accountId', async () => {
      const accountId = 'invalid';
      const addBalanceDto: AddBalanceDto = { value: 100 };
      const correlationId = '123456';

      try {
        await controller.addBalance(accountId, addBalanceDto, correlationId);
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.message).toBe('Invalid AccountId');
      }
    });
  });

  describe('getBalance', () => {
    it('should get account balance successfully', async () => {
      const accountId = '1';
      const correlationId = '123456';

      jest.spyOn(service, 'getAccountBalance').mockResolvedValue({
        accountId: 1,
        balance: 200,
      });

      const result = await controller.getBalance(accountId, correlationId);

      expect(result).toEqual({
        accountId: 1,
        balance: 200,
      });
    });

    it('should throw BadRequestException for invalid accountId', async () => {
      const accountId = 'invalid';
      const correlationId = '123456';

      try {
        await controller.getBalance(accountId, correlationId);
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.message).toBe('Invalid AccountId');
      }
    });
  });
});
