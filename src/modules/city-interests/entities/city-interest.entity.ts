import { ApiProperty } from '@nestjs/swagger';

export class CityInterest {
  @ApiProperty()
  id: number;

  @ApiProperty()
  userId: number;

  @ApiProperty()
  cityId: number;
}
