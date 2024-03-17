import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CityRankingDto {
  @ApiPropertyOptional()
  countryIso2?: string;

  @ApiPropertyOptional()
  @Type(() => Number)
  page?: number;

  @ApiPropertyOptional()
  @Type(() => Number)
  count?: number;

  @ApiPropertyOptional()
  date?: number;
}
