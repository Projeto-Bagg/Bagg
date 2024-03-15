import { ApiProperty } from '@nestjs/swagger';

export class CountryVisitRankingDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  iso2: string;

  @ApiProperty()
  totalVisit: number;
}
