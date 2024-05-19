import { ApiPropertyOptional } from '@nestjs/swagger';
import { PaginationDto } from 'src/commons/entities/pagination';

export class CityRankingDto extends PaginationDto {
  @ApiPropertyOptional()
  countryIso2?: string;

  @ApiPropertyOptional()
  date?: number;
}
