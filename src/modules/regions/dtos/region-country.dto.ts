import { ApiProperty } from '@nestjs/swagger';
import { CountryEntity } from 'src/modules/countries/entities/country.entity';
import { RegionEntity } from 'src/modules/regions/entities/region.entity';

export class RegionCountryDto extends RegionEntity {
  @ApiProperty({ type: CountryEntity })
  country: CountryEntity;
}
