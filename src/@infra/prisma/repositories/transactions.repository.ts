import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Transaction } from 'src/@domain/entities/transaction.entity';
import { ICreateTransactionRepository } from 'src/@domain/interfaces/repositories/transaction/ICreateTransactionRepository';
import { User } from 'src/@domain/entities/user.entity';

@Injectable()
export class TransactionRepository implements ICreateTransactionRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async create(payer: User, payee: User, value: number): Promise<Transaction> {
    return await this.prismaService.$transaction(async (prisma) => {
      await this.prismaService.account.update({
        where: { id: payer.account.id },
        data: {
          balance: {
            decrement: value,
          },
        },
        select: {
          balance: true,
        },
      });

      await this.prismaService.account.update({
        where: { id: payee.account.id },
        data: {
          balance: {
            increment: value,
          },
        },
        select: {
          balance: true,
        },
      });

      const newTransaction = await prisma.transaction.create({
        data: {
          payerId: payer.account.id,
          payeeId: payee.account.id,
          value: value,
        },
      });

      return newTransaction;
    });
  }
}
