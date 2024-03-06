import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class FindByUserCityInterestDto {
  @ApiPropertyOptional()
  @Type(() => Number)
  count?: number;

  @ApiPropertyOptional()
  @Type(() => Number)
  page?: number;
}
