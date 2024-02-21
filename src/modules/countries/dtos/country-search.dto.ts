import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CountrySearchDto {
  @ApiProperty()
  q: string;

  @ApiPropertyOptional()
  page?: number;

  @ApiProperty()
  count: number;
}
