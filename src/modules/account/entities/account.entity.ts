import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Account } from '@prisma/client';
import { Exclude } from 'class-transformer';
import { AdminEntity } from 'src/modules/admin/entities/admin.entity';
import { UserEntity } from 'src/modules/users/entities/user.entity';

export class AccountEntity implements Account {
  @ApiProperty()
  id: number;

  @Exclude()
  email: string;

  @ApiProperty()
  active: boolean;

  @Exclude()
  password: string;

  @ApiPropertyOptional()
  user?: UserEntity | null;

  @ApiPropertyOptional()
  admin?: AdminEntity | null;
}
