import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { User } from 'src/@domain/entities/user.entity';
import { USER_TYPE } from 'src/@domain/enum/USER_TYPE';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { Account } from 'src/@domain/entities/account.entity';
import { CreateUserDto } from 'src/@domain/dtos/user/create-user.dto';
import { IFindAllUsersRepository } from 'src/@domain/interfaces/repositories/user/IFindAllUsersRepository';
import { ICreateUserRepository } from 'src/@domain/interfaces/repositories/user/ICreateUserRepository';
import { IFindUserByIdRepository } from 'src/@domain/interfaces/repositories/user/IFindUserByIdRepository';
import { IFindUserByAccountIdRepository } from 'src/@domain/interfaces/repositories/user/IFindUserByAccountIdRepository';
import { IUpdateUserRepository } from 'src/@domain/interfaces/repositories/user/IUpdateUserRepository';
import { IDeleteUserRepository } from 'src/@domain/interfaces/repositories/user/IDeleteUserRepository';

@Injectable()
export class UserRepository
  implements
    IFindAllUsersRepository,
    ICreateUserRepository,
    IFindUserByIdRepository,
    IFindUserByAccountIdRepository,
    IUpdateUserRepository,
    IDeleteUserRepository
{
  constructor(private readonly prismaService: PrismaService) {}

  async findAll(): Promise<User[]> {
    const users = await this.prismaService.user.findMany({
      select: {
        id: true,
        fullname: true,
        email: true,
        cpfCnpj: true,
        type: true,
        Account: { select: { id: true, balance: true } },
      },
    });

    return users.map((user) => {
      return new User(
        user.id,
        user.fullname,
        user.email,
        user.cpfCnpj,
        USER_TYPE[user.type],
        null,
        new Account(user.Account.id, user.Account.balance),
      );
    });
  }

  async create(user: CreateUserDto): Promise<User> {
    try {
      return await this.prismaService.$transaction(async (prisma) => {
        const newUser = await prisma.user.create({
          data: user,
          select: {
            id: true,
            fullname: true,
            email: true,
            cpfCnpj: true,
            type: true,
          },
        });

        const newAccount = await prisma.account.create({
          data: {
            userId: newUser.id,
          },
          select: {
            id: true,
            balance: true,
          },
        });

        return new User(
          newUser.id,
          newUser.fullname,
          newUser.email,
          newUser.cpfCnpj,
          USER_TYPE[newUser.type],
          null,
          new Account(newAccount.id, newAccount.balance),
        );
      });
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        if (error.meta?.target[0] === 'email')
          throw new Error('Email already exists');

        if (error.meta?.target[0] === 'cpfCnpj')
          throw new Error('CpfCnpj already exists');
      }
      throw error;
    }
  }

  async findOne(userId: number): Promise<User | null> {
    const user = await this.prismaService.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        fullname: true,
        email: true,
        cpfCnpj: true,
        type: true,
        Account: { select: { id: true, balance: true } },
      },
    });

    if (!user) return null;

    return new User(
      user.id,
      user.fullname,
      user.email,
      user.cpfCnpj,
      USER_TYPE[user.type],
      null,
      new Account(user.Account.id, user.Account.balance),
    );
  }

  async findByAccountId(accountId: number): Promise<User | null> {
    const user = await this.prismaService.user.findFirst({
      where: { Account: { id: accountId } },
      select: {
        id: true,
        fullname: true,
        email: true,
        cpfCnpj: true,
        type: true,
        Account: { select: { id: true, balance: true } },
      },
    });

    if (!user) return null;

    return new User(
      user.id,
      user.fullname,
      user.email,
      user.cpfCnpj,
      USER_TYPE[user.type],
      null,
      new Account(user.Account.id, user.Account.balance),
    );
  }

  async update(userId: number, user: Partial<CreateUserDto>): Promise<User> {
    try {
      const updatedUser = await this.prismaService.user.update({
        where: { id: userId },
        data: user,
        select: {
          id: true,
          fullname: true,
          email: true,
          cpfCnpj: true,
          type: true,
          Account: { select: { id: true, balance: true } },
          createdAt: true,
          updatedAt: true,
        },
      });

      return new User(
        updatedUser.id,
        updatedUser.fullname,
        updatedUser.email,
        updatedUser.cpfCnpj,
        USER_TYPE[updatedUser.type],
        null,
        new Account(updatedUser.Account.id, updatedUser.Account.balance),
        updatedUser.createdAt,
        updatedUser.updatedAt,
      );
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new Error('User not found');
      }
      throw error;
    }
  }

  async delete(userId: number): Promise<void> {
    try {
      return await this.prismaService.$transaction(async (prisma) => {
        await prisma.account.delete({
          where: { userId: userId },
        });

        await prisma.user.delete({
          where: { id: userId },
        });
      });
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new Error('User not found');
      }
      throw error;
    }
  }
}
