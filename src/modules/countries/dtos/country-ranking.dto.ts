import { ApiProperty } from '@nestjs/swagger';

export class CountryRankingDto {
  @ApiProperty()
  page: number;

  @ApiProperty()
  count: number;
}
