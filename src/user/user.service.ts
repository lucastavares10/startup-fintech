import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { LoggingService } from 'src/@common/logger/logger.service';
import { CreateUserDto } from 'src/@domain/dtos/user/create-user.dto';
import { UpdateUserDto } from 'src/@domain/dtos/user/update-user.dto';
import { UserRepository } from 'src/@infra/prisma/repositories/user.repository';

@Injectable()
export class UserService {
  constructor(
    private readonly loggingService: LoggingService,
    private readonly userRepository: UserRepository,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const { fullname, email, password, cpfCnpj, type } = createUserDto;

    try {
      const newUser = await this.userRepository.create({
        fullname,
        email,
        cpfCnpj,
        type,
        password,
      });

      return newUser;
    } catch (error) {
      if (error.message === 'Email or CpfCnpj already exists') {
        throw new ConflictException('Email or CpfCnpj already exists');
      }
      throw error;
    }
  }

  async findAll() {
    return await this.userRepository.findAll();
  }

  async findOne(userId: number) {
    const user = await this.userRepository.findOne(userId);

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    return user;
  }

  async update(userId: number, updateUserDto: UpdateUserDto) {
    const { fullname, email, password, cpfCnpj, type } = updateUserDto;

    try {
      const updatedUser = await this.userRepository.update(userId, {
        fullname,
        email,
        cpfCnpj,
        type,
        password,
      });

      return updatedUser;
    } catch (error) {
      if (error.message === 'User not found') {
        throw new NotFoundException(`User with ID ${userId} not found`);
      }
      throw error;
    }
  }

  async remove(userId: number) {
    try {
      await this.userRepository.delete(userId);
    } catch (error) {
      if (error.message === 'User not found') {
        throw new NotFoundException(`User with ID ${userId} not found`);
      }
      throw error;
    }
  }
}
