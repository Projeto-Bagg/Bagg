import { ApiProperty } from '@nestjs/swagger';
import { CityRegionCountryEntity } from 'src/modules/cities/entities/city-region-country.entity';
import { UserWithFollowersFollowindDto } from 'src/modules/users/dtos/user-with-followers-following.dto';

export class UserFullInfoDto extends UserWithFollowersFollowindDto {
  @ApiProperty({ type: CityRegionCountryEntity })
  city: CityRegionCountryEntity | null;

  constructor(partial: UserFullInfoDto) {
    super(partial);
    Object.assign(this, partial);
  }
}
