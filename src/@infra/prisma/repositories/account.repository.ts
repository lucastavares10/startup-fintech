import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class AccountRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async increaseBalance(
    accountId: number,
    value: number,
  ): Promise<{ newBalance: number }> {
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

    return { newBalance: updatedAccount.balance };
  }

  async decreaseBalance(
    accountId: number,
    value: number,
  ): Promise<{ newBalance: number }> {
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

    return { newBalance: updatedAccount.balance };
  }
}
