import { Injectable } from '@nestjs/common'
import { PrismaService } from '../../database/prisma.service'
import { CreateTransactionDto } from '../dtos/transactions.dto'

@Injectable()
export class TransactionRepository {
  constructor(private prisma: PrismaService) {}

  findByUserId(userId: number) {
    return this.prisma.transfer.findMany({
      where: {
        OR: [{ senderId: userId }, { recipientId: userId }],
      },
      orderBy: { createdAt: 'desc' },
    })
  }

  create(data: CreateTransactionDto) {
    return this.prisma.transfer.create({ data })
  }
}