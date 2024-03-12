import { ApiProperty } from '@nestjs/swagger';

export class CountryInterestRankingDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  iso2: string;

  @ApiProperty()
  totalInterest: number;
}
