import { ApiProperty } from '@nestjs/swagger';

export class Follow {
  @ApiProperty()
  id: number;

  @ApiProperty()
  followerId: number;

  @ApiProperty()
  followingId: number;
}
