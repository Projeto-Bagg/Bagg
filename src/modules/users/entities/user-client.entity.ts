import { ApiProperty } from '@nestjs/swagger';
import { UserEntity } from 'src/modules/users/entities/user.entity';

export class UserClient extends UserEntity {
  @ApiProperty()
  followers: number;

  @ApiProperty()
  following: number;

  @ApiProperty()
  isFollowing: boolean;

  @ApiProperty()
  followedBy: boolean;

  constructor(partial: UserClient) {
    super(partial);
    Object.assign(this, partial);
  }
}
