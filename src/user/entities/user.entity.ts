import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength, IsNumber } from 'class-validator';

export class UserEntity {
  @ApiProperty({ example: 1 })
  @IsNumber()
  id!: number;

  @ApiProperty({ example: 'Enzo Santos' })
  @IsString()
  name!: string;

  @ApiProperty({ example: 'enzo@example.com' })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: 'password123', minLength: 8 })
  @IsString()
  @MinLength(8)
  password!: string;

  @ApiProperty({ example: 1000.5 })
  @IsNumber()
  balance!: number;
}
