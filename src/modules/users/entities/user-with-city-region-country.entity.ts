import { ApiProperty } from '@nestjs/swagger';
import { CityRegionCountryEntity } from 'src/modules/cities/entities/city-region-country.entity';
import { CityEntity } from 'src/modules/cities/entities/city.entity';
import { UserEntity } from 'src/modules/users/entities/user.entity';

export class UserEntityWithCityRegionCountry extends UserEntity {
  @ApiProperty({ type: CityEntity })
  city: CityRegionCountryEntity | null;

  constructor(partial: UserEntityWithCityRegionCountry) {
    super(partial);
    Object.assign(this, partial);
  }
}
