import { ApiProperty } from '@nestjs/swagger';
import { Tip } from '@prisma/client';
import { UserEntity } from 'src/modules/users/entities/user.entity';

export class TipEntity implements Tip {
  @ApiProperty()
  id: number;

  @ApiProperty()
  message: string;

  @ApiProperty()
  userId: number;

  @ApiProperty()
  cityId: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty({ type: UserEntity })
  user: UserEntity;

  constructor(partial: TipEntity) {
    Object.assign(this, { ...partial, user: new UserEntity(partial.user) });
  }
}
