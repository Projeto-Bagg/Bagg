import { ApiPropertyOptional } from '@nestjs/swagger';
import { PaginationDto } from 'src/commons/entities/pagination';

export class CountryRankingDto extends PaginationDto {
  @ApiPropertyOptional()
  date?: number;

  @ApiPropertyOptional()
  continent?: number;
}
