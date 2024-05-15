import { ApiProperty } from '@nestjs/swagger';
import { CityRegionCountryDto } from '../../cities/dtos/city-region-country.dto';
import { UserWithFollowersFollowingDto } from './user-with-followers-following.dto';

export class UserFullInfoDto extends UserWithFollowersFollowingDto {
  @ApiProperty({ type: CityRegionCountryDto })
  city: CityRegionCountryDto | null;

  constructor(partial: UserFullInfoDto) {
    super(partial);
    Object.assign(this, partial);
  }
}
