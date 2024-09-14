export interface IDeleteUserRepository {
  delete(userId: number): Promise<void>;
}
