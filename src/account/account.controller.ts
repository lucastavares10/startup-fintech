import {
  Controller,
  Body,
  Patch,
  Param,
  BadRequestException,
  Headers,
  Get,
} from '@nestjs/common';
import { AccountService } from './account.service';
import { AddBalanceDto } from 'src/@domain/dtos/account/add-balance.dto';
import {
  ApiHeaders,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Account')
@Controller('account')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @ApiOperation({ summary: 'Add balance to an account' })
  @ApiParam({
    name: 'accountId',
    type: 'string',
    description: 'ID of the account to add balance to',
  })
  @ApiResponse({ status: 200, description: 'Balance successfully added.' })
  @ApiResponse({
    status: 400,
    description: 'Invalid account ID or balance data.',
  })
  @ApiResponse({ status: 404, description: 'Account not found.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  @ApiHeaders([
    {
      name: 'x-correlation-id',
      description: 'Correlation ID for request tracing',
      required: false,
    },
  ])
  @Patch('/add-balance/:accountId')
  addBalance(
    @Param('accountId') accountId: string,
    @Body() addBalanceDto: AddBalanceDto,
    @Headers('x-correlation-id') correlationId: string,
  ) {
    if (isNaN(+accountId)) {
      throw new BadRequestException('Invalid AccountId');
    }

    return this.accountService.addAccountBalance(
      +accountId,
      addBalanceDto,
      correlationId,
    );
  }

  @ApiOperation({ summary: 'Get the balance of an account' })
  @ApiParam({
    name: 'accountId',
    type: 'string',
    description: 'ID of the account to retrieve balance',
  })
  @ApiResponse({
    status: 200,
    description: 'Account balance retrieved successfully.',
  })
  @ApiResponse({ status: 400, description: 'Invalid account ID.' })
  @ApiResponse({ status: 404, description: 'Account not found.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  @ApiHeaders([
    {
      name: 'x-correlation-id',
      description: 'Correlation ID for request tracing',
      required: false,
    },
  ])
  @Get('/get-balance/:accountId')
  getBalance(
    @Param('accountId') accountId: string,
    @Headers('x-correlation-id') correlationId: string,
  ) {
    if (isNaN(+accountId)) {
      throw new BadRequestException('Invalid AccountId');
    }

    return this.accountService.getAccountBalance(+accountId, correlationId);
  }
}
