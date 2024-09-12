import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Transaction } from 'src/@domain/entities/transaction.entity';

@Injectable()
export class TransactionRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async create(transaction: Transaction): Promise<Transaction> {
    const newTransaction = await this.prismaService.transaction.create({
      data: transaction,
    });

    return newTransaction;
  }
}
