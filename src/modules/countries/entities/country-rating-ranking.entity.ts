import { ApiProperty } from '@nestjs/swagger';

export class CountryRatingRankingEntity {
  @ApiProperty()
  name: string;

  @ApiProperty()
  iso2: string;

  @ApiProperty()
  averageRanking: number;
}
