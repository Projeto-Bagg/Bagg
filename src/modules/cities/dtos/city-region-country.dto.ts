import { ApiProperty } from '@nestjs/swagger';
import { CityEntity } from 'src/modules/cities/entities/city.entity';
import { RegionCountryDto } from 'src/modules/regions/dtos/region-country.dto';

export class CityRegionCountryDto extends CityEntity {
  @ApiProperty({ type: RegionCountryDto })
  region: RegionCountryDto;
}
