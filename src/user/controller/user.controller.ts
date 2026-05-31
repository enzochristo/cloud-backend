import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  HttpCode,
  HttpStatus,
  Patch,
} from '@nestjs/common';
import { AddBalanceDto } from '../dtos/add-balance.dto'

import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { UserService } from '../service/user.service';
import { RegisterDto } from '../dtos/register.dto';
import { LoginDto } from '../dtos/login.dto';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  @ApiOperation({ summary: 'List all users' })
  findAll() {
    return this.userService.findAll();
  }

  @Post('register')
  @ApiOperation({ summary: 'Create a new bank account' })
  register(@Body() dto: RegisterDto) {
    return this.userService.register(dto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  @ApiOperation({ summary: 'Login to account' })
  login(@Body() dto: LoginDto) {
    return this.userService.login(dto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by id' })
  findById(@Param('id') id: string) {
    return this.userService.findById(Number(id))
  }

  @Patch(':id/balance')
  @ApiOperation({ summary: 'Add balance to user' })
  addBalance(@Param('id') id: string, @Body() dto: AddBalanceDto) {
    return this.userService.addBalance(Number(id), dto.amount)
  }
}
