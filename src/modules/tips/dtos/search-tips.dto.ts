import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';

export class SearchTipsDto {
  @ApiPropertyOptional()
  @Type(() => String)
  q?: string;

  @ApiPropertyOptional()
  @Transform((tags) => tags.value.split(';'))
  @Type(() => Array<string>)
  tags?: string[];

  @ApiPropertyOptional()
  @Type(() => Number)
  city?: number;

  @ApiPropertyOptional({ default: 10 })
  @Type(() => Number)
  count?: number;

  @ApiPropertyOptional({ default: 1 })
  @Type(() => Number)
  page?: number;
}
