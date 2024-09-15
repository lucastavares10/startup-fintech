import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class AddBalanceDto {
  @ApiProperty({ required: true })
  @IsNotEmpty({ message: 'value is required' })
  @IsNumber()
  value: number;
}
