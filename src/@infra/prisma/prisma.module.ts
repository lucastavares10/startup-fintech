import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { UserRepository } from './repositories/user.repository';
import { AccountRepository } from './repositories/account.repository';
import { TransactionRepository } from './repositories/transactions.repository';

@Global()
@Module({
  imports: [],
  providers: [
    PrismaService,
    UserRepository,
    AccountRepository,
    TransactionRepository,
  ],
  exports: [UserRepository, AccountRepository, TransactionRepository],
})
export class PrismaModule {}
