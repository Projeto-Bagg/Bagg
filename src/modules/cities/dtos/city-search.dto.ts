import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CitySearchDto {
  @ApiProperty()
  q: string;

  @ApiPropertyOptional()
  page?: number;

  @ApiPropertyOptional()
  count?: number;
}
