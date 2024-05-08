import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class SearchTipsDto {
  @ApiPropertyOptional()
  @Type(() => String)
  q?: string;

  @ApiPropertyOptional()
  @Type(() => Array<string>)
  tags?: string[];

  @ApiPropertyOptional({ default: 10 })
  @Type(() => Number)
  count?: number;

  @ApiPropertyOptional({ default: 1 })
  @Type(() => Number)
  page?: number;
}
