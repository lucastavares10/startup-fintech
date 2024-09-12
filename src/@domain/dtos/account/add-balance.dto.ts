import { IsNotEmpty, IsNumber } from 'class-validator';

export class AddBalanceDto {
  @IsNotEmpty({ message: 'value is required' })
  @IsNumber()
  value: number;
}
