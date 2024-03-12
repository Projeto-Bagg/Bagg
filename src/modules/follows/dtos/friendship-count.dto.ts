import { ApiProperty } from '@nestjs/swagger';

export class FriendshipCountDto {
  @ApiProperty()
  following: number;

  @ApiProperty()
  followers: number;
}
