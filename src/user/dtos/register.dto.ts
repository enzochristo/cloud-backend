import { PickType } from '@nestjs/swagger';
import { UserEntity } from '../entities/user.entity';

export class RegisterDto extends PickType(UserEntity, [
  'name',
  'email',
  'password',
] as const) {}
