import { ApiProperty } from '@nestjs/swagger';
import { DiaryPostLike } from '@prisma/client';

export class DiaryPostLikeEntity implements DiaryPostLike {
  @ApiProperty()
  id: number;

  @ApiProperty()
  userId: number;

  @ApiProperty()
  postId: number;

  @ApiProperty()
  tipId: number;

  @ApiProperty()
  createdAt: Date;
}
