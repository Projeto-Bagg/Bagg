import { ApiProperty } from '@nestjs/swagger';

export class FriendshipStatusDto {
  @ApiProperty()
  isFollowing: boolean;

  @ApiProperty()
  followedBy: boolean;
}
