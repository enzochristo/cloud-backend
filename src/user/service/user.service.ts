import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { UserRepository } from '../repository/user.repository';
import { RegisterDto } from '../dtos/register.dto';
import { LoginDto } from '../dtos/login.dto';

@Injectable()
export class UserService {
  constructor(private userRepository: UserRepository) {}

  async register(dto: RegisterDto) {
    try {
      const user = await this.userRepository.create({ ...dto, balance: 0 });
      const { password: _, ...result } = user;
      return result;
    } catch {
      throw new ConflictException('Email already exists');
    }
  }

  async login(dto: LoginDto) {
    const user = await this.userRepository.findByEmailAndPassword(dto.email, dto.password);
    if (!user) throw new NotFoundException('Invalid email or password');
    const { password: _, ...result } = user;
    return result;
  }
}
