import { ApiProperty } from '@nestjs/swagger';
import { TipComment } from '@prisma/client';

export class TipCommentEntity implements TipComment {
  @ApiProperty()
  id: number;

  @ApiProperty()
  userId: number;

  @ApiProperty()
  tipId: number;

  @ApiProperty()
  message: string;

  @ApiProperty()
  createdAt: Date;
}
