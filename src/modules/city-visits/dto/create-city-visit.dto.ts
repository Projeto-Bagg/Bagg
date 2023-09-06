import { ApiProperty } from '@nestjs/swagger';

export class CreateCityVisitDto {
  @ApiProperty()
  userId: number;

  @ApiProperty()
  cityId: number;

  @ApiProperty()
  rating: number;

  @ApiProperty()
  message: string;
}
