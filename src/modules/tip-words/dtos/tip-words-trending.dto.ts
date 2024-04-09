import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class TipWordsTrendingDto {
  @ApiProperty()
  @Type(() => Boolean)
  sortByCount: boolean;

  @ApiProperty()
  @Type(() => Date)
  startDate: Date;

  @ApiProperty()
  @Type(() => Date)
  endDate: Date;
}
