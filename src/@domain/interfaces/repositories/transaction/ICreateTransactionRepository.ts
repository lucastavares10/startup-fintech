import { Transaction } from 'src/@domain/entities/transaction.entity';
import { User } from 'src/@domain/entities/user.entity';

export interface ICreateTransactionRepository {
  create(payer: User, payee: User, value: number): Promise<Transaction>;
}
