export interface IDecreaseBalanceRepository {
  decreaseBalance(
    accountId: number,
    value: number,
  ): Promise<{ newBalance: number }>;
}
