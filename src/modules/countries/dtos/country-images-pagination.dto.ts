import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CountryImagesPaginationDto {
  @ApiPropertyOptional()
  @Type(() => Number)
  page?: number;

  @ApiPropertyOptional()
  @Type(() => Number)
  count?: number;
}
