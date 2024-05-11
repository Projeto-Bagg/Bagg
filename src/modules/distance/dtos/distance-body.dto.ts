import { ApiProperty } from '@nestjs/swagger';
import { CityRegionCountryDto } from 'src/modules/cities/dtos/city-region-country.dto';

export class DistanceBodyDto {
  @ApiProperty({ type: Array<number> })
  ids: number[];
}
