import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { IDecreaseBalanceRepository } from 'src/@domain/interfaces/repositories/account/IDecreaseBalanceRepository';
import { IIncreaseBalanceRepository } from 'src/@domain/interfaces/repositories/account/IIncreaseBalanceRepository';

@Injectable()
export class AccountRepository
  implements IDecreaseBalanceRepository, IIncreaseBalanceRepository
{
  constructor(private readonly prismaService: PrismaService) {}

  async increaseBalance(
    accountId: number,
    value: number,
  ): Promise<{ accountId: number; newBalance: number }> {
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
  }

  async decreaseBalance(
    accountId: number,
    value: number,
  ): Promise<{ accountId: number; newBalance: number }> {
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
  }
}
