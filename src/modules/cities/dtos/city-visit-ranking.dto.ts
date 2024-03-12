import { ApiProperty } from '@nestjs/swagger';
import { RegionCountryDto } from 'src/modules/regions/dtos/region-country.dto';

export class CityVisitRankingDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  totalVisit: number;

  @ApiProperty({ type: RegionCountryDto })
  region: RegionCountryDto;
}
