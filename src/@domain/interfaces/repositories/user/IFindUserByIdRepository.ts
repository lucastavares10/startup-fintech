import { User } from 'src/@domain/entities/user.entity';

export interface IFindUserByIdRepository {
  findOne(userId: number): Promise<User | null>;
}
