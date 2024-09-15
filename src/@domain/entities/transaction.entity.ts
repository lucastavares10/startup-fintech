export class Transaction {
  id?: number;
  payerId: number;
  payeeId: number;
  value: number;
  timestamp?: Date;

  constructor(
    id?: number,
    payerId?: number,
    payeeId?: number,
    value?: number,
    timestamp?: Date,
  ) {
    this.id = id;
    this.payerId = payerId;
    this.payeeId = payeeId;
    this.value = value;
    this.timestamp = timestamp;
  }
}
