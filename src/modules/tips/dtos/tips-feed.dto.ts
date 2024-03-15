import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class TipsFeedDto {
  @ApiPropertyOptional({ default: 10 })
  @Type(() => Number)
  count?: number;

  @ApiPropertyOptional({ default: 1 })
  @Type(() => Number)
  page?: number;
}
