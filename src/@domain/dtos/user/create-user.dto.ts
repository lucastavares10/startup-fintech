import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  Length,
  MinLength,
} from 'class-validator';
import { USER_TYPE } from 'src/@domain/enum/USER_TYPE';

export class CreateUserDto {
  @ApiProperty({ required: true })
  @IsNotEmpty({ message: 'Fullname is required' })
  fullname: string;

  @ApiProperty({ required: true })
  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail({}, { message: 'Invalid email format' })
  email: string;

  @ApiProperty({ required: true })
  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password: string;

  @ApiProperty({ required: true })
  @IsNotEmpty({ message: 'CPF/CNPJ is required' })
  @Length(11, 14, {
    message: 'CPF/CNPJ must be 11 or 14 characters long',
  })
  cpfCnpj: string;

  @ApiProperty({
    required: true,
    enum: [Object.values(USER_TYPE).map((type) => type)],
  })
  @IsNotEmpty({
    message: `Type is required. (${Object.values(USER_TYPE).map((type) => type)})`,
  })
  @IsEnum(USER_TYPE, {
    message: `Invalid user type. (${Object.values(USER_TYPE).map((type) => type)})`,
  })
  type: USER_TYPE;
}
