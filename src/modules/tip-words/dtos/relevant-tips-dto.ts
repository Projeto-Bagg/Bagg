import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class RelevantTipsDto {
  @ApiPropertyOptional()
  wordCount?: number;

  @ApiPropertyOptional()
  @Type(() => Date)
  startDate?: Date;

  @ApiPropertyOptional()
  @Type(() => Date)
  endDate?: Date;

  @ApiPropertyOptional()
  @Type(() => Date)
  tipStartDate?: Date;
}
