import { ApiProperty } from '@nestjs/swagger';
import { CityRegionCountryDto } from 'src/modules/cities/dtos/city-region-country.dto';
import { CityVisitEntity } from 'src/modules/city-visits/entities/city-visit.entity';

export class UserCityVisitDto extends CityVisitEntity {
  @ApiProperty({ type: CityRegionCountryDto })
  city: CityRegionCountryDto;
}
