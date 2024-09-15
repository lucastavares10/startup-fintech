import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { IDecreaseBalanceRepository } from 'src/@domain/interfaces/repositories/account/IDecreaseBalanceRepository';
import { IIncreaseBalanceRepository } from 'src/@domain/interfaces/repositories/account/IIncreaseBalanceRepository';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class AccountRepository
  implements IDecreaseBalanceRepository, IIncreaseBalanceRepository
{
  constructor(private readonly prismaService: PrismaService) {}

  async increaseBalance(
    accountId: number,
    value: number,
  ): Promise<{ accountId: number; newBalance: number }> {
    try {
      const updatedAccount = await this.prismaService.account.update({
        where: { id: accountId },
        data: {
          balance: {
            increment: value,
          },
        },
        select: {
          balance: true,
        },
      });

      return { accountId, newBalance: updatedAccount.balance };
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new Error('Account not found');
      }
      throw error;
    }
  }

  async decreaseBalance(
    accountId: number,
    value: number,
  ): Promise<{ accountId: number; newBalance: number }> {
    try {
      const updatedAccount = await this.prismaService.account.update({
        where: { id: accountId },
        data: {
          balance: {
            decrement: value,
          },
        },
        select: {
          balance: true,
        },
      });

      return { accountId, newBalance: updatedAccount.balance };
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new Error('Account not found');
      }
      throw error;
    }
  }
}
