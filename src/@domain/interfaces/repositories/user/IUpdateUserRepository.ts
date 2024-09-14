import { CreateUserDto } from 'src/@domain/dtos/user/create-user.dto';
import { User } from 'src/@domain/entities/user.entity';

export interface IUpdateUserRepository {
  update(userId: number, user: Partial<CreateUserDto>): Promise<User>;
}
