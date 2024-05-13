import { ApiProperty } from '@nestjs/swagger';
import { Country } from '@prisma/client';
import { Type } from 'class-transformer';

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

  @ApiProperty()
  @Type(() => Number)
  continentId: number | null;
}
