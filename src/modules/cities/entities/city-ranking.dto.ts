import { ApiProperty } from '@nestjs/swagger';

export class CityRankingDto {
  @ApiProperty()
  page: number;

  @ApiProperty()
  count: number;
}
