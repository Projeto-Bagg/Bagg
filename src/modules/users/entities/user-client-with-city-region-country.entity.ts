import { ApiProperty } from '@nestjs/swagger';
import { CityRegionCountryEntity } from 'src/modules/cities/entities/city-region-country.entity';
import { CityEntity } from 'src/modules/cities/entities/city.entity';
import { UserClient } from 'src/modules/users/entities/user-client.entity';

export class UserClientWithCityRegionCountry extends UserClient {
  @ApiProperty({ type: CityEntity })
  city: CityRegionCountryEntity;

  constructor(partial: UserClientWithCityRegionCountry) {
    super(partial);
    Object.assign(this, partial);
  }
}
