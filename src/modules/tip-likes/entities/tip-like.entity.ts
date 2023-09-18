import { ApiProperty } from '@nestjs/swagger';
import { TipLike } from '@prisma/client';

export class TipLikeEntity implements TipLike {
  @ApiProperty()
  id: number;

  @ApiProperty()
  userId: number;

  @ApiProperty()
  tipId: number;

  @ApiProperty()
  createdAt: Date;
}
