import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class TransferDto {
  @ApiProperty({ required: true, description: 'Account ID from payer' })
  @IsNotEmpty({ message: 'payer is required' })
  @IsNumber()
  payer: number;

  @ApiProperty({ required: true, description: 'Account ID from payee' })
  @IsNotEmpty({
    message: 'payee is required',
  })
  @IsNumber()
  payee: number;

  @ApiProperty({ required: true })
  @IsNotEmpty({ message: 'value is required' })
  @IsNumber()
  value: number;
}
