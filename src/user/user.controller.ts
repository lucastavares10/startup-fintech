import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  BadRequestException,
  Headers,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from 'src/@domain/dtos/user/create-user.dto';
import { UpdateUserDto } from 'src/@domain/dtos/user/update-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(
    @Body() createUserDto: CreateUserDto,
    @Headers('x-correlation-id') correlationId: string,
  ) {
    return this.userService.create(createUserDto, correlationId);
  }

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get(':userId')
  findOne(@Param('userId') userId: string) {
    if (isNaN(+userId)) {
      throw new BadRequestException('Invalid UserID');
    }

    return this.userService.findOne(+userId);
  }

  @Patch(':userId')
  update(
    @Param('userId') userId: string,
    @Body() updateUserDto: UpdateUserDto,
    @Headers('x-correlation-id') correlationId: string,
  ) {
    if (isNaN(+userId)) {
      throw new BadRequestException('Invalid UserID');
    }

    return this.userService.update(+userId, updateUserDto, correlationId);
  }

  @HttpCode(204)
  @Delete(':userId')
  remove(
    @Param('userId') userId: string,
    @Headers('x-correlation-id') correlationId: string,
  ) {
    if (isNaN(+userId)) {
      throw new BadRequestException('Invalid UserID');
    }

    return this.userService.remove(+userId, correlationId);
  }
}
