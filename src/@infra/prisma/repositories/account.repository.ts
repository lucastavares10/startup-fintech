import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class AccountRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async addBalance(
    accountId: number,
    value: number,
  ): Promise<{ newBalance: number }> {
    const account = await this.prismaService.account.findUnique({
      where: { id: accountId },
    });

    if (!account) throw new Error('Account not found');

    const updatedAccount = await this.prismaService.account.update({
      where: { id: account.id },
      data: { balance: account.balance + value },
      select: {
        balance: true,
      },
    });

    return { newBalance: updatedAccount.balance };
  }
}
