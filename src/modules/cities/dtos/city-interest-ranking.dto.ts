import { ApiProperty } from '@nestjs/swagger';
import { RegionCountryDto } from 'src/modules/regions/dtos/region-country.dto';

export class CityInterestRankingDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  totalInterest: number;

  @ApiProperty({ type: RegionCountryDto })
  region: RegionCountryDto;
}
