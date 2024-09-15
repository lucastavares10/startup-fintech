import { CACHE_MANAGER } from '@nestjs/cache-manager';
import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Cache } from 'cache-manager';
import { HashingService } from 'src/@common/hashing/hashing.service';
import { LoggingService } from 'src/@common/logger/logger.service';
import { CreateUserDto } from 'src/@domain/dtos/user/create-user.dto';
import { UpdateUserDto } from 'src/@domain/dtos/user/update-user.dto';
import { REGISTRY_TYPE } from 'src/@domain/enum/REGISTRY_TYPE';
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
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  async create(createUserDto: CreateUserDto, correlationId: string) {
    try {
      const passwordHash = await this.hashingService.hash(
        createUserDto.password,
      );

      const newUser = await this.createUserRepository.create({
        ...createUserDto,
        password: passwordHash,
      });

      await this.cacheManager.set(`user_${newUser.id}`, newUser);

      this.loggingService.log(
        REGISTRY_TYPE.CREATE_USER,
        'User Created',
        correlationId,
      );

      return newUser;
    } catch (error) {
      this.loggingService.error(
        REGISTRY_TYPE.ERROR,
        `Error in Create user: ${error.message}`,
        correlationId,
      );

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
    const cachedUser = await this.cacheManager.get(`user_${userId}`);

    if (cachedUser) return cachedUser;

    const user = await this.findUserByIdRepository.findOne(userId);

    await this.cacheManager.set(`user_${user.id}`, user);

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    return user;
  }

  async update(
    userId: number,
    updateUserDto: UpdateUserDto,
    correlationId: string,
  ) {
    const { fullname, email, password, cpfCnpj, type } = updateUserDto;

    try {
      const updatedUser = await this.updateUserRepository.update(userId, {
        fullname,
        email,
        cpfCnpj,
        type,
        password,
      });

      await this.cacheManager.set(`user_${updatedUser.id}`, updatedUser);

      this.loggingService.log(
        REGISTRY_TYPE.UPDATE_USER,
        'User updated',
        correlationId,
      );

      return updatedUser;
    } catch (error) {
      this.loggingService.error(
        REGISTRY_TYPE.ERROR,
        `Error in update user: ${error.message}`,
        correlationId,
      );

      if (error.message === 'User not found') {
        throw new NotFoundException(`User with ID ${userId} not found`);
      }
      throw error;
    }
  }

  async remove(userId: number, correlationId: string) {
    try {
      await this.deleteUserRepository.delete(userId);

      await this.cacheManager.del(`user_${userId}`);

      this.loggingService.log(
        REGISTRY_TYPE.DELETE_USER,
        `User deleted: ID ${userId}`,
        correlationId,
      );
    } catch (error) {
      this.loggingService.error(
        REGISTRY_TYPE.ERROR,
        `Error in delete user with ID ${userId}: ${error.message}`,
        correlationId,
      );

      if (error.message === 'User not found') {
        throw new NotFoundException(`User with ID ${userId} not found`);
      }
      throw error;
    }
  }
}
