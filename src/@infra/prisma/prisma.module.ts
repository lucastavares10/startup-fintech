import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { UserRepository } from './repositories/user.repository';
import { AccountRepository } from './repositories/account.repository';
import { TransactionRepository } from './repositories/transactions.repository';
import {
  CREATE_TRANSACTION_REPOSITORY,
  CREATE_USER_REPOSITORY,
  DECREASE_BALANCE_ACCOUNT_REPOSITORY,
  DELETE_USER_REPOSITORY,
  FIND_ALL_USER_REPOSITORY,
  FIND_USER_BY_ACCOUNT_ID_REPOSITORY,
  FIND_USER_BY_ID_REPOSITORY,
  GET_BALANCE_ACCOUNT_REPOSITORY,
  INCREASE_BALANCE_ACCOUNT_REPOSITORY,
  UPDATE_USER_REPOSITORY,
} from 'src/@domain/interfaces/repositories/constants';

@Global()
@Module({
  imports: [],
  providers: [
    PrismaService,
    UserRepository,
    AccountRepository,
    TransactionRepository,
    {
      provide: CREATE_USER_REPOSITORY,
      useClass: UserRepository,
    },
    {
      provide: FIND_ALL_USER_REPOSITORY,
      useClass: UserRepository,
    },
    {
      provide: FIND_USER_BY_ID_REPOSITORY,
      useClass: UserRepository,
    },
    {
      provide: FIND_USER_BY_ACCOUNT_ID_REPOSITORY,
      useClass: UserRepository,
    },
    {
      provide: UPDATE_USER_REPOSITORY,
      useClass: UserRepository,
    },
    {
      provide: DELETE_USER_REPOSITORY,
      useClass: UserRepository,
    },
    {
      provide: DECREASE_BALANCE_ACCOUNT_REPOSITORY,
      useClass: AccountRepository,
    },
    {
      provide: INCREASE_BALANCE_ACCOUNT_REPOSITORY,
      useClass: AccountRepository,
    },
    {
      provide: GET_BALANCE_ACCOUNT_REPOSITORY,
      useClass: AccountRepository,
    },
    {
      provide: CREATE_TRANSACTION_REPOSITORY,
      useClass: TransactionRepository,
    },
  ],
  exports: [
    UserRepository,
    AccountRepository,
    TransactionRepository,
    CREATE_USER_REPOSITORY,
    FIND_ALL_USER_REPOSITORY,
    FIND_USER_BY_ID_REPOSITORY,
    FIND_USER_BY_ACCOUNT_ID_REPOSITORY,
    UPDATE_USER_REPOSITORY,
    DELETE_USER_REPOSITORY,
    DECREASE_BALANCE_ACCOUNT_REPOSITORY,
    INCREASE_BALANCE_ACCOUNT_REPOSITORY,
    GET_BALANCE_ACCOUNT_REPOSITORY,
    CREATE_TRANSACTION_REPOSITORY,
  ],
})
export class PrismaModule {}
