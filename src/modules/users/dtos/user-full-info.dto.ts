import { ApiProperty } from '@nestjs/swagger';
import { CityRegionCountryDto } from '../../cities/dtos/city-region-country.dto';
import { UserClientDto } from 'src/modules/users/dtos/user-client.dto';

export class UserFullInfoDto extends UserClientDto {
  @ApiProperty()
  followers: number;

  @ApiProperty()
  following: number;

  @ApiProperty({ type: CityRegionCountryDto })
  city: CityRegionCountryDto | null;
}
