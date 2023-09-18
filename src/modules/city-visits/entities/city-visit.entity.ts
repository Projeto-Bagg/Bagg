import { ApiProperty } from '@nestjs/swagger';
import { CityVisit } from '@prisma/client';

export class CityVisitEntity implements CityVisit {
  @ApiProperty()
  id: number;

  @ApiProperty()
  userId: number;

  @ApiProperty()
  cityId: number;

  @ApiProperty()
  rating: number;

  @ApiProperty()
  message: string;
}
