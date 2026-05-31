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
      include: {
        sender: { select: { id: true, name: true } },
        recipient: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: 'desc' },
    })
  }

  create(data: CreateTransactionDto) {
    return this.prisma.transfer.create({ data })
  }
}