import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class TipWordByCountDto {
  @ApiProperty()
  @Type(() => String)
  word: string;

  @ApiProperty()
  @Type(() => Number)
  count: number;
}
