import { ApiProperty } from '@nestjs/swagger';
import { Follow } from '@prisma/client';

export class FollowEntity implements Follow {
  @ApiProperty()
  id: number;

  @ApiProperty()
  followerId: number;

  @ApiProperty()
  followingId: number;

  @ApiProperty()
  createdAt: Date;
}
