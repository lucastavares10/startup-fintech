export class Account {
  id?: number;
  balance: number;
  createdAt?: Date;
  updatedAt?: Date;

  constructor(
    id?: number,
    balance?: number,
    createdAt?: Date,
    updatedAt?: Date,
  ) {
    this.id = id;
    this.balance = balance;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}
