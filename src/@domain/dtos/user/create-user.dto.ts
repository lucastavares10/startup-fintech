import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  Length,
  MinLength,
} from 'class-validator';
import { USER_TYPE } from 'src/@domain/enum/USER_TYPE';

export class CreateUserDto {
  @IsNotEmpty({ message: 'Fullname is required' })
  fullname: string;

  @IsEmail({}, { message: 'Invalid email format' })
  email: string;

  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password: string;

  @Length(11, 14, {
    message: 'CPF/CNPJ must be 11 or 14 characters long',
  })
  cpfCnpj: string;

  @IsEnum(USER_TYPE, {
    message: `Invalid user type. (${Object.values(USER_TYPE).map((type) => type)})`,
  })
  type: USER_TYPE;
}
