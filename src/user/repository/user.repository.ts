import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { RegisterDto } from '../dtos/register.dto';

@Injectable()
export class UserRepository {
  constructor(private prisma: PrismaService) {}

  create(data: RegisterDto & { balance: number }) {
    return this.prisma.user.create({ data });
  }

  findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  findByEmailAndPassword(email: string, password: string) {
    return this.prisma.user.findFirst({ where: { email, password } });
  }
}
