import { ApiProperty } from '@nestjs/swagger';

export class CountryVisitRankingEntity {
  @ApiProperty()
  name: string;

  @ApiProperty()
  iso2: string;

  @ApiProperty()
  totalVisit: number;
}
