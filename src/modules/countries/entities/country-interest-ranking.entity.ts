import { ApiProperty } from '@nestjs/swagger';

export class CountryInterestRankingEntity {
  @ApiProperty()
  name: string;

  @ApiProperty()
  iso2: string;

  @ApiProperty()
  totalInterest: number;
}
