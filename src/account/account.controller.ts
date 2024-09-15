import {
  Controller,
  Body,
  Patch,
  Param,
  BadRequestException,
  Headers,
} from '@nestjs/common';
import { AccountService } from './account.service';
import { AddBalanceDto } from 'src/@domain/dtos/account/add-balance.dto';

@Controller('account')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

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
}
