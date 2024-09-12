import { USER_TYPE } from '../enum/USER_TYPE';
import { Account } from './account.entity';

export class User {
  id?: number;
  fullname: string;
  email: string;
  cpfCnpj: string;
  type: USER_TYPE;
  password: string;
  account?: Account;
  createdAt?: Date;
  updatedAt?: Date;
}
