import { ApiProperty } from '@nestjs/swagger';

export class CountryRatingRankingDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  iso2: string;

  @ApiProperty()
  averageRanking: number;
}
