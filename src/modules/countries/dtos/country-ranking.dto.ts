import { ApiPropertyOptional } from '@nestjs/swagger';

export class CountryRankingDto {
  @ApiPropertyOptional()
  page?: number;

  @ApiPropertyOptional()
  count?: number;
}
