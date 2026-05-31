import { ApiProperty } from '@nestjs/swagger'

export class TransactionEntity {
  @ApiProperty({ example: 1 })
  id!: number

  @ApiProperty({ example: 1 })
  senderId!: number

  @ApiProperty({ example: 2 })
  recipientId!: number

  @ApiProperty({ example: 100.5 })
  amount!: number

  @ApiProperty({ example: 'in_process' })
  status!: string

  @ApiProperty()
  createdAt!: Date
}