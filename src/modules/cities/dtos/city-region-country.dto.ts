import { ApiProperty } from '@nestjs/swagger';
import { CityEntity } from 'src/modules/cities/entities/city.entity';
import { RegionCountryEntity } from 'src/modules/regions/entities/region-country.entity';

export class CityRegionCountryDto extends CityEntity {
  @ApiProperty({ type: RegionCountryEntity })
  region: RegionCountryEntity;
}
