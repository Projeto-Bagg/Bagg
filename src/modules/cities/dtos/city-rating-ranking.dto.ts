import { ApiProperty } from '@nestjs/swagger';

export class CityRatingRankingDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  iso2: string;

  @ApiProperty()
  averageRanking: number;
}
