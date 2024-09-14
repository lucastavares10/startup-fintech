import { User } from 'src/@domain/entities/user.entity';

export interface IFindAllUsersRepository {
  findAll(): Promise<User[]>;
}
