import { Body, Controller, Get, Post, Query } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger'
import { TransactionService } from '../service/transaction.service'
import { CreateTransactionDto } from '../dtos/transactions.dto'

@ApiTags('transactions')
@Controller('transactions')
export class TransactionsController {
  constructor(private transactionService: TransactionService) {}

  @Get()
  @ApiOperation({ summary: 'List transactions of a user' })
  @ApiQuery({ name: 'userId', required: true, type: Number })
  findByUserId(@Query('userId') userId: string) {
    return this.transactionService.findByUserId(Number(userId))
  }

  @Post()
  @ApiOperation({ summary: 'Send a transfer' })
  create(@Body() dto: CreateTransactionDto) {
    return this.transactionService.create(dto)
  }
}