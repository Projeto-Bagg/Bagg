import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CityRankingDto {
  @ApiPropertyOptional()
  @Type(() => Number)
  page?: number;

  @ApiPropertyOptional()
  @Type(() => Number)
  count?: number;
}
