import { ApiProperty } from '@nestjs/swagger';
import { CityInterest } from '@prisma/client';

export class CityInterestEntity implements CityInterest {
  @ApiProperty()
  id: number;

  @ApiProperty()
  userId: number;

  @ApiProperty()
  cityId: number;

  @ApiProperty()
  createdAt: Date;
}
