export interface IGetBalanceRepository {
  getBalance(
    accountId: number,
  ): Promise<{ accountId: number; balance: number }>;
}
