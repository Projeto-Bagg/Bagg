import { ApiProperty } from '@nestjs/swagger';

export class CityInterestRankingEntity {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  totalInterest: number;

  @ApiProperty()
  countryIso2: string;

  @ApiProperty()
  countryName: string;
}
