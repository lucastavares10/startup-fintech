import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  Length,
  MinLength,
} from 'class-validator';
import { USER_TYPE } from 'src/@domain/enum/USER_TYPE';

export class CreateUserDto {
  @IsOptional()
  id?: number;

  @IsNotEmpty({ message: 'Fullname is required' })
  fullname: string;

  @IsEmail({}, { message: 'Invalid email format' })
  email: string;

  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password: string;

  @Length(11, 16, {
    message: 'CPF/CNPJ must be between 11 and 16 characters long',
  })
  cpfCnpj: string;

  @IsEnum(USER_TYPE, { message: 'Invalid user type' })
  type: USER_TYPE;

  @IsOptional()
  createdAt?: Date;

  @IsOptional()
  updatedAt?: Date;
}
