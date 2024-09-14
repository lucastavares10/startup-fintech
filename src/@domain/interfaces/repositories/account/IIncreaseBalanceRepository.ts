export interface IIncreaseBalanceRepository {
  increaseBalance(
    accountId: number,
    value: number,
  ): Promise<{ newBalance: number }>;
}
