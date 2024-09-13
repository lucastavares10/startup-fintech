import { User } from '../entities/user.entity';

export interface ITransfer {
  handle(payer: User, payeeId: number, value: number): Promise<void>;
}
