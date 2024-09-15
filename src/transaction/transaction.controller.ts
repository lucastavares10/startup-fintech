import { Controller, Post, Body, HttpCode, Headers } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { TransferDto } from 'src/@domain/dtos/transaction/transfer.dto';
import {
  ApiBody,
  ApiHeaders,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Transactions')
@Controller('transfer')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @HttpCode(200)
  @ApiOperation({ summary: 'Execute a transfer between users' })
  @ApiResponse({ status: 200, description: 'Transfer successful.' })
  @ApiResponse({ status: 400, description: 'Invalid data.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  @ApiHeaders([
    {
      name: 'x-correlation-id',
      description: 'Correlation ID for request tracing',
      required: false,
    },
  ])
  @ApiBody({
    description: `
      Request body for transferring funds between accounts. 
      - **payer**: The Account ID of the user sending the funds.
      - **payee**: The Account ID of the user receiving the funds.
      - **value**: The amount to transfer between the two accounts.

      - To retrieve account ID use the GET /user endpoint.
    `,
    type: TransferDto,
  })
  @Post()
  async transfer(
    @Body() transferDto: TransferDto,
    @Headers('x-correlation-id') correlationId: string,
  ) {
    return await this.transactionService.handle(transferDto, correlationId);
  }
}
