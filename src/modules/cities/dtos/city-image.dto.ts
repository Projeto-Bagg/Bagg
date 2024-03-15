import { ApiProperty } from '@nestjs/swagger';
import { MediaEntity } from 'src/modules/media/entities/media.entity';
import { UserEntity } from 'src/modules/users/entities/user.entity';

export class CityImageDto extends MediaEntity {
  @ApiProperty()
  userId: number;

  @ApiProperty({ type: UserEntity })
  user: UserEntity;
}
