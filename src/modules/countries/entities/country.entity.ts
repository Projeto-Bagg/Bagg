import { ApiProperty } from '@nestjs/swagger';
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
  regionId: number;

  @ApiProperty()
  latitude: number;

  @ApiProperty()
  longitude: number;
}
