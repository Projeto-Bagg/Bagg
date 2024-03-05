import { ApiProperty } from '@nestjs/swagger';
import { CityRegionCountryEntity } from 'src/modules/cities/entities/city-region-country.entity';
import { UserWithFollowersFollowingDto } from 'src/modules/users/dtos/user-with-followers-following.dto';

export class UserFullInfoDto extends UserWithFollowersFollowingDto {
  @ApiProperty({ type: CityRegionCountryEntity })
  city: CityRegionCountryEntity | null;

  constructor(partial: UserFullInfoDto) {
    super(partial);
    Object.assign(this, partial);
  }
}
