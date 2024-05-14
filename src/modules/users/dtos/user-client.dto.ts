import { ApiProperty } from '@nestjs/swagger';
import { FriendshipStatusDto } from '../../follows/dtos/friendship-status.dto';
import { UserEntity } from '../entities/user.entity';

export class UserClientDto extends UserEntity {
  @ApiProperty({ type: FriendshipStatusDto })
  friendshipStatus: FriendshipStatusDto;

  constructor(partial: UserClientDto) {
    super(partial);
    Object.assign(this, partial);
  }
}
