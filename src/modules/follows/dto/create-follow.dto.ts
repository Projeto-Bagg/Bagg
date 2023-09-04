import { ApiProperty } from '@nestjs/swagger';

export class CreateFollowDto {
  @ApiProperty()
  followingId: number;

  @ApiProperty()
  followerId: number;
}
