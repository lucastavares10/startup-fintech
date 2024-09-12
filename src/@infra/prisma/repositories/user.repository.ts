import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { User } from 'src/@domain/entities/user.entity';
import { USER_TYPE } from 'src/@domain/enum/USER_TYPE';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { OutputUserDto } from 'src/@domain/dtos/user/output-user.dto';

@Injectable()
export class UserRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async findAll(): Promise<OutputUserDto[]> {
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
      return {
        id: user.id,
        fullname: user.fullname,
        email: user.email,
        cpfCnpj: user.cpfCnpj,
        account: { id: user.Account.id, balance: user.Account.balance },
        type: USER_TYPE[user.type],
      };
    });
  }

  async create(user: User): Promise<OutputUserDto> {
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

        return {
          ...newUser,
          account: { id: newAccount.id, balance: newAccount.balance },
          type: USER_TYPE[newUser.type],
        };
      });
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new Error('Email or CpfCnpj already exists');
      }
      throw error;
    }
  }

  async findOne(userId: number): Promise<OutputUserDto | null> {
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

    return {
      id: user.id,
      fullname: user.fullname,
      email: user.email,
      cpfCnpj: user.cpfCnpj,
      account: { id: user.Account.id, balance: user.Account.balance },
      type: USER_TYPE[user.type],
    };
  }

  async update(userId: number, user: Partial<User>): Promise<OutputUserDto> {
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
        },
      });

      return {
        id: updatedUser.id,
        fullname: updatedUser.fullname,
        email: updatedUser.email,
        cpfCnpj: updatedUser.cpfCnpj,
        account: {
          id: updatedUser.Account.id,
          balance: updatedUser.Account.balance,
        },
        type: USER_TYPE[updatedUser.type],
      };
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
