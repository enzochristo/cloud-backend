import { ApiProperty } from '@nestjs/swagger'
import { IsNumber, IsPositive } from 'class-validator'

export class AddBalanceDto {
  @ApiProperty({ example: 100 })
  @IsNumber()
  @IsPositive()
  amount!: number
}