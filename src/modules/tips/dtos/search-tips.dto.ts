import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { PaginationDto } from 'src/commons/entities/pagination';

export class SearchTipsDto extends PaginationDto {
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
}
