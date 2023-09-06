import { ApiProperty } from '@nestjs/swagger';

export class CreateCityInterestDto {
  @ApiProperty()
  userId: number;

  @ApiProperty()
  cityId: number;
}
