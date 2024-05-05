import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Country } from '@prisma/client';

export class CountryEntity implements Country {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  capital: string;

  @ApiProperty()
  iso2: string;

  @ApiProperty()
  latitude: number;

  @ApiProperty()
  longitude: number;

  @ApiPropertyOptional()
  continentId: number | null;
}
