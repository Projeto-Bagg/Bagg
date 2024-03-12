import { ApiPropertyOptional } from '@nestjs/swagger';

export class CityRankingDto {
  @ApiPropertyOptional()
  page?: number;

  @ApiPropertyOptional()
  count?: number;
}
