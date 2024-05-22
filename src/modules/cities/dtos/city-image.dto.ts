import { ApiProperty } from '@nestjs/swagger';
import { MediaEntity } from '../../media/entities/media.entity';
import { UserEntity } from '../../users/entities/user.entity';

export class CityImageDto extends MediaEntity {
  @ApiProperty()
  userId: number;

  @ApiProperty({ type: UserEntity })
  user: UserEntity;
}
