import { ApiProperty } from '@nestjs/swagger';

export class CityVisit {
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
