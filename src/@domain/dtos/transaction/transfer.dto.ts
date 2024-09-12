import { IsNotEmpty, IsNumber } from 'class-validator';

export class TransferDto {
  @IsNotEmpty({ message: 'payer is required' })
  @IsNumber()
  payer: number;

  @IsNotEmpty({ message: 'payee is required' })
  @IsNumber()
  payee: number;

  @IsNotEmpty({ message: 'value is required' })
  @IsNumber()
  value: number;
}
