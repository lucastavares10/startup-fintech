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
    {
      provide: 'ICreateUserRepository',
      useClass: UserRepository,
    },
    {
      provide: 'IFindAllUsersRepository',
      useClass: UserRepository,
    },
    {
      provide: 'IFindUserByIdRepository',
      useClass: UserRepository,
    },
    {
      provide: 'IFindUserByAccountIdRepository',
      useClass: UserRepository,
    },
    {
      provide: 'IUpdateUserRepository',
      useClass: UserRepository,
    },
    {
      provide: 'IDeleteUserRepository',
      useClass: UserRepository,
    },
    {
      provide: 'IDecreaseBalanceRepository',
      useClass: AccountRepository,
    },
    {
      provide: 'IIncreaseBalanceRepository',
      useClass: AccountRepository,
    },
    {
      provide: 'IGetBalanceRepository',
      useClass: AccountRepository,
    },
    {
      provide: 'ICreateTransactionRepository',
      useClass: TransactionRepository,
    },
  ],
  exports: [
    UserRepository,
    AccountRepository,
    TransactionRepository,
    'ICreateUserRepository',
    'IFindAllUsersRepository',
    'IFindUserByIdRepository',
    'IFindUserByAccountIdRepository',
    'IUpdateUserRepository',
    'IDeleteUserRepository',
    'IDecreaseBalanceRepository',
    'IIncreaseBalanceRepository',
    'IGetBalanceRepository',
    'ICreateTransactionRepository',
  ],
})
export class PrismaModule {}
