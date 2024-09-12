import { USER_TYPE } from 'src/@domain/enum/USER_TYPE';

export class OutputUserDto {
  id: number;
  fullname: string;
  email: string;
  cpfCnpj: string;
  type: USER_TYPE;
  account: { id: number; balance: number };
  createdAt?: Date;
  updatedAt?: Date;
}
