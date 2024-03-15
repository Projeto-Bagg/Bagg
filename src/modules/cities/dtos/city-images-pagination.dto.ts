import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CityImagesPaginationDto {
  @ApiPropertyOptional()
  @Type(() => Number)
  page?: number;

  @ApiPropertyOptional()
  @Type(() => Number)
  count?: number;
}
