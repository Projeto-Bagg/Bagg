import { ApiProperty } from '@nestjs/swagger';
import { CountryEntity } from '../../countries/entities/country.entity';
import { RegionEntity } from '../entities/region.entity';

export class RegionCountryDto extends RegionEntity {
  @ApiProperty({ type: CountryEntity })
  country: CountryEntity;
}
