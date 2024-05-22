import { ApiProperty } from '@nestjs/swagger';
import { CityRegionCountryDto } from '../../cities/dtos/city-region-country.dto';
import { CityVisitEntity } from '../entities/city-visit.entity';

export class UserCityVisitDto extends CityVisitEntity {
  @ApiProperty({ type: CityRegionCountryDto })
  city: CityRegionCountryDto;
}
