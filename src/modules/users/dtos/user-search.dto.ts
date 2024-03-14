import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class UserSearchDto {
  @ApiProperty()
  q: string;

  @ApiPropertyOptional()
  @Type(() => Number)
  page?: number;

  @ApiPropertyOptional()
  @Type(() => Number)
  count?: number;
}
