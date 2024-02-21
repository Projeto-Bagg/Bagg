import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CitySearchDto {
  @ApiProperty()
  q: string;

  @ApiPropertyOptional()
  page?: number;

  @ApiProperty()
  count: number;
}
