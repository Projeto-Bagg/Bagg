import { ApiProperty } from '@nestjs/swagger';
import { City } from '@prisma/client';

export class CityEntity implements City {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  regionId: number;

  @ApiProperty()
  message: string;
}
