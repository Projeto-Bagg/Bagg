import { ApiProperty } from '@nestjs/swagger';
import { CityRegionCountryDto } from 'src/modules/cities/dtos/city-region-country.dto';
import { TripDiaryEntity } from 'src/modules/trip-diaries/entities/trip-diary.entity';
import { UserEntity } from 'src/modules/users/entities/user.entity';

export class TripDiaryClientDto extends TripDiaryEntity {
  @ApiProperty({ type: CityRegionCountryDto })
  city: CityRegionCountryDto;

  @ApiProperty({ type: UserEntity })
  user: UserEntity;

  @ApiProperty()
  postsAmount: number;

  constructor(partial: TripDiaryClientDto) {
    super();
    Object.assign(this, { ...partial, user: new UserEntity(partial.user) });
  }
}
