import { ApiProperty } from '@nestjs/swagger';

export class CityNearDto {
  @ApiProperty()
  cityId: number;

  @ApiProperty()
  page: number;

  @ApiProperty()
  count: number;
}
