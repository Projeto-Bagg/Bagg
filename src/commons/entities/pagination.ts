import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class PaginationDto {
  @ApiPropertyOptional({ default: 1 })
  @Type(() => Number)
  page?: number;

  @ApiPropertyOptional({ default: 10 })
  @Type(() => Number)
  count?: number;
}
