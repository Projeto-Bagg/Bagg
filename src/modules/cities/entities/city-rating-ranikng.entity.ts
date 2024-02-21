import { ApiProperty } from '@nestjs/swagger';

export class CityRatingRankingEntity {
  @ApiProperty()
  name: string;

  @ApiProperty()
  iso2: string;

  @ApiProperty()
  averageRanking: number;
}
