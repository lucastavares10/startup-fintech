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
import {
  ApiHeaders,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Users')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({ status: 201, description: 'User successfully created.' })
  @ApiResponse({ status: 400, description: 'Invalid user data.' })
  @ApiResponse({ status: 409, description: 'Email or CpfCnpj already exists.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  @ApiHeaders([
    {
      name: 'x-correlation-id',
      description: 'Correlation ID for request tracing',
      required: false,
    },
  ])
  @Post()
  create(
    @Body() createUserDto: CreateUserDto,
    @Headers('x-correlation-id') correlationId: string,
  ) {
    return this.userService.create(createUserDto, correlationId);
  }

  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({
    status: 200,
    description: 'List of users',
  })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @ApiOperation({ summary: 'Get user by ID' })
  @ApiParam({
    name: 'userId',
    type: 'string',
    description: 'ID of the user',
  })
  @ApiResponse({ status: 200, description: 'User retrieved successfully.' })
  @ApiResponse({ status: 400, description: 'Invalid user ID.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  @Get(':userId')
  findOne(@Param('userId') userId: string) {
    if (isNaN(+userId)) {
      throw new BadRequestException('Invalid UserID');
    }

    return this.userService.findOne(+userId);
  }

  @ApiOperation({ summary: 'Update a user by ID' })
  @ApiParam({
    name: 'userId',
    type: 'string',
    description: 'ID of the user to update',
  })
  @ApiResponse({ status: 200, description: 'User updated successfully.' })
  @ApiResponse({ status: 400, description: 'Invalid user ID or data.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  @ApiHeaders([
    {
      name: 'x-correlation-id',
      description: 'Correlation ID for request tracing',
      required: false,
    },
  ])
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
  @ApiOperation({ summary: 'Delete a user by ID' })
  @ApiParam({
    name: 'userId',
    type: 'string',
    description: 'ID of the user to delete',
  })
  @ApiResponse({ status: 204, description: 'User deleted successfully.' })
  @ApiResponse({ status: 400, description: 'Invalid user ID.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  @ApiHeaders([
    {
      name: 'x-correlation-id',
      description: 'Correlation ID for request tracing',
      required: false,
    },
  ])
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
