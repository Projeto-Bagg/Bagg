import { ApiProperty } from '@nestjs/swagger';
import { FriendshipStatusDto } from 'src/modules/follows/dtos/friendship-status.dto';
import { UserEntity } from 'src/modules/users/entities/user.entity';

export class UserClientDto extends UserEntity {
  @ApiProperty({ type: FriendshipStatusDto })
  friendshipStatus: FriendshipStatusDto;

  constructor(partial: UserClientDto) {
    super(partial);
    Object.assign(this, partial);
  }
}
