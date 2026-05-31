import { ApiProperty } from '@nestjs/swagger'
import { IsInt, IsNumber, IsPositive } from 'class-validator'

export class CreateTransactionDto {
  @ApiProperty({ example: 1 })
  @IsInt()
  senderId!: number

  @ApiProperty({ example: 2 })
  @IsInt()
  recipientId!: number

  @ApiProperty({ example: 100.5 })
  @IsNumber()
  @IsPositive()
  amount!: number
}