import { ApiProperty } from '@nestjs/swagger';

export class CreateCityVisitDto {
  @ApiProperty()
  cityId: number;

  @ApiProperty()
  rating: number;

  @ApiProperty()
  message?: string;
}
