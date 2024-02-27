import { ApiProperty } from '@nestjs/swagger';
import { CityVisit } from '@prisma/client';

export class CityVisitEntity implements CityVisit {
  @ApiProperty()
  id: number;

  @ApiProperty()
  userId: number;

  @ApiProperty()
  cityId: number;

  @ApiProperty({ type: Number })
  rating: number | null;

  @ApiProperty({ type: String })
  message: string | null;

  @ApiProperty()
  createdAt: Date;
}
