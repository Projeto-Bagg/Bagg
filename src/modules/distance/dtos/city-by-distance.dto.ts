import { ApiProperty } from '@nestjs/swagger';
import { CityRegionCountryDto } from 'src/modules/cities/dtos/city-region-country.dto';

class CityByDistanceDto extends CityRegionCountryDto {
  @ApiProperty()
  distance: number;

  constructor(partial: CityByDistanceDto) {
    super();
    Object.assign(this, partial);
  }
}

export class CityDistanceComparedToId {
  @ApiProperty()
  id: number;

  @ApiProperty({ type: CityByDistanceDto, isArray: true })
  places: CityByDistanceDto[];
}
