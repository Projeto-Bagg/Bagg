import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class FindUserByCityDto {
  @ApiProperty()
  cityId: number;

  @ApiPropertyOptional()
  @Type(() => Number)
  page?: number;

  @ApiPropertyOptional()
  @Type(() => Number)
  count?: number;
}
