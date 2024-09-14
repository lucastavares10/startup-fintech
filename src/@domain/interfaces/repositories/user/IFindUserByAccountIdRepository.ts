import { User } from 'src/@domain/entities/user.entity';

export interface IFindUserByAccountIdRepository {
  findByAccountId(accountId: number): Promise<User | null>;
}
