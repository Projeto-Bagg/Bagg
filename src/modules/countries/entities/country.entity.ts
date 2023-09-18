import { ApiProperty } from '@nestjs/swagger';
import { Country } from '@prisma/client';

export class CountryEntity implements Country {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  message: string;

  @ApiProperty()
  code: string;
}
