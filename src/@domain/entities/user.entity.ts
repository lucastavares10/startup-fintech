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

  constructor(
    id?: number,
    fullname?: string,
    email?: string,
    cpfCnpj?: string,
    type?: USER_TYPE,
    password?: string,
    account?: Account,
    createdAt?: Date,
    updatedAt?: Date,
  ) {
    this.id = id;
    this.fullname = fullname;
    this.email = email;
    this.cpfCnpj = cpfCnpj;
    this.type = type!;
    this.password = password;
    this.account = account;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  public isMerchant(): boolean {
    return this.type === USER_TYPE.MERCHANT;
  }

  public isCommon(): boolean {
    return this.type === USER_TYPE.COMMON;
  }

  public hasBalance(value: number) {
    return value < this.account.balance;
  }
}
