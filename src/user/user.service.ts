import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { HashingService } from 'src/@common/hashing/hashing.service';
import { LoggingService } from 'src/@common/logger/logger.service';
import { CreateUserDto } from 'src/@domain/dtos/user/create-user.dto';
import { UpdateUserDto } from 'src/@domain/dtos/user/update-user.dto';
import { ICreateUserRepository } from 'src/@domain/interfaces/repositories/user/ICreateUserRepository';
import { IDeleteUserRepository } from 'src/@domain/interfaces/repositories/user/IDeleteUserRepository';
import { IFindAllUsersRepository } from 'src/@domain/interfaces/repositories/user/IFindAllUsersRepository';
import { IFindUserByIdRepository } from 'src/@domain/interfaces/repositories/user/IFindUserByIdRepository';
import { IUpdateUserRepository } from 'src/@domain/interfaces/repositories/user/IUpdateUserRepository';

@Injectable()
export class UserService {
  constructor(
    private readonly loggingService: LoggingService,
    @Inject('ICreateUserRepository')
    private readonly createUserRepository: ICreateUserRepository,
    @Inject('IFindAllUsersRepository')
    private readonly findAllUsersRepository: IFindAllUsersRepository,
    @Inject('IFindUserByIdRepository')
    private readonly findUserByIdRepository: IFindUserByIdRepository,
    @Inject('IUpdateUserRepository')
    private readonly updateUserRepository: IUpdateUserRepository,
    @Inject('IDeleteUserRepository')
    private readonly deleteUserRepository: IDeleteUserRepository,
    private readonly hashingService: HashingService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    try {
      const passwordHash = await this.hashingService.hash(
        createUserDto.password,
      );

      const newUser = await this.createUserRepository.create({
        ...createUserDto,
        password: passwordHash,
      });

      return newUser;
    } catch (error) {
      if (error.message === 'Email already exists')
        throw new ConflictException('Email already exists');

      if (error.message === 'CpfCnpj already exists')
        throw new ConflictException('CpfCnpj already exists');

      throw error;
    }
  }

  async findAll() {
    return await this.findAllUsersRepository.findAll();
  }

  async findOne(userId: number) {
    const user = await this.findUserByIdRepository.findOne(userId);

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    return user;
  }

  async update(userId: number, updateUserDto: UpdateUserDto) {
    const { fullname, email, password, cpfCnpj, type } = updateUserDto;

    try {
      const updatedUser = await this.updateUserRepository.update(userId, {
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
      await this.deleteUserRepository.delete(userId);
    } catch (error) {
      if (error.message === 'User not found') {
        throw new NotFoundException(`User with ID ${userId} not found`);
      }
      throw error;
    }
  }
}
