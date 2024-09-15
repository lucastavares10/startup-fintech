export interface IIncreaseBalanceRepository {
  increaseBalance(
    accountId: number,
    value: number,
  ): Promise<{ accountId: number; newBalance: number }>;
}
