import { ApiProperty } from '@nestjs/swagger';
import { UserClientDto } from 'src/modules/users/dtos/user-client.dto';

export class UserWithFollowersFollowingDto extends UserClientDto {
  @ApiProperty()
  followers: number;

  @ApiProperty()
  following: number;

  constructor(partial: UserWithFollowersFollowingDto) {
    super(partial);
    Object.assign(this, partial);
  }
}
