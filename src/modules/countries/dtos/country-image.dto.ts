import { ApiProperty } from '@nestjs/swagger';
import { CityEntity } from 'src/modules/cities/entities/city.entity';
import { MediaEntity } from 'src/modules/media/entities/media.entity';
import { UserEntity } from 'src/modules/users/entities/user.entity';

export class CountryImageDto extends MediaEntity {
  @ApiProperty()
  userId: number;

  @ApiProperty({ type: UserEntity })
  user: UserEntity;

  @ApiProperty()
  city: CityEntity;
}
