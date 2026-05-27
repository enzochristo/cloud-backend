import { Injectable, NotFoundException, ConflictException, InternalServerErrorException } from '@nestjs/common';
import { UserRepository, UserPublic } from '../repository/user.repository';
import { RegisterDto } from '../dtos/register.dto';
import { LoginDto } from '../dtos/login.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private userRepository: UserRepository) {}

  async register(dto: RegisterDto) {
    try {
      const user = await this.userRepository.create({ ...dto, balance: 0 });
      const { password: _, ...result } = user;
      return result;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new ConflictException('Email already exists');
      }
      throw new InternalServerErrorException();
    }
  }

  findAll(): Promise<UserPublic[]> {
    return this.userRepository.findAll();
  }

  async login(dto: LoginDto) {
    const user = await this.userRepository.findByEmailAndPassword(dto.email, dto.password);
    if (!user) throw new NotFoundException('Invalid email or password');
    const { password: _, ...result } = user;
    return result;
  }
}
