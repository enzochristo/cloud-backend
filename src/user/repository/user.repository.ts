import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../database/prisma.service';
import { RegisterDto } from '../dtos/register.dto';

export type UserPublic = Prisma.UserGetPayload<{
  select: { id: true; name: true; email: true; balance: true };
}>;

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

  findAll(): Promise<UserPublic[]> {
    return this.prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        balance: true,
      },
    });
  }
}
