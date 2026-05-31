import { Module } from '@nestjs/common'
import { UserController } from './user/controller/user.controller'
import { UserService } from './user/service/user.service'
import { UserRepository } from './user/repository/user.repository'
import { TransactionsController } from './dashboard/controller/transactions.controller'
import { TransactionService } from './dashboard/service/transaction.service'
import { TransactionRepository } from './dashboard/repository/transaction.repository'
import { PrismaService } from './database/prisma.service'

@Module({
  controllers: [UserController, TransactionsController],
  providers: [
    UserService,
    UserRepository,
    TransactionService,
    TransactionRepository,
    PrismaService,
  ],
})
export class AppModule {}