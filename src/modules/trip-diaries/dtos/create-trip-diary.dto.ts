import { ApiProperty } from '@nestjs/swagger';
import { MaxLength } from 'class-validator';

export class CreateTripDiaryDto {
  @ApiProperty()
  @MaxLength(255)
  title: string;

  @ApiProperty()
  @MaxLength(300)
  message: string;

  @ApiProperty()
  cityId: number;
}
