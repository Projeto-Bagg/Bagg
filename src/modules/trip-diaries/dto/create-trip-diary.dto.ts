import { ApiProperty } from '@nestjs/swagger';

export class CreateTripDiaryDto {
  @ApiProperty()
  title: string;

  @ApiProperty()
  message: string;
}
