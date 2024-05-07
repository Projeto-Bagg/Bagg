import { ApiProperty } from '@nestjs/swagger';
import { CityRegionCountryDto } from 'src/modules/cities/dtos/city-region-country.dto';

export class CityByDistanceDto extends CityRegionCountryDto {
  @ApiProperty({ type: Number })
  distance: number;

  constructor(partial: CityByDistanceDto) {
    super();
    Object.assign(this, partial);
  }
}
