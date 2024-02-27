import { ApiProperty } from '@nestjs/swagger';

export class NearCityEntity {
  @ApiProperty()
  name: string;

  @ApiProperty()
  averageRating: number;

  @ApiProperty()
  distance: number;
}
