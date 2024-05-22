import { ApiProperty } from '@nestjs/swagger';
import { CityEntity } from '../entities/city.entity';
import { RegionCountryDto } from '../../regions/dtos/region-country.dto';

export class CityRegionCountryDto extends CityEntity {
  @ApiProperty({ type: RegionCountryDto })
  region: RegionCountryDto;
}
