import { Injectable } from '@nestjs/common'
import { TransactionRepository } from '../repository/transaction.repository'
import { CreateTransactionDto } from '../dtos/transactions.dto'

@Injectable()
export class TransactionService {
  constructor(private transactionRepository: TransactionRepository) {}

  findByUserId(userId: number) {
    return this.transactionRepository.findByUserId(userId)
  }

  create(dto: CreateTransactionDto) {
    return this.transactionRepository.create(dto)
  }
}