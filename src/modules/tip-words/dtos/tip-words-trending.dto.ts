import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class TipWordsTrendingDto {
  @ApiPropertyOptional()
  @Type(() => Boolean)
  sortByCount: boolean;

  @ApiPropertyOptional()
  @Type(() => Date)
  startDate?: Date;

  @ApiPropertyOptional()
  @Type(() => Date)
  endDate?: Date;
}
