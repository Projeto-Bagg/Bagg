import { ApiProperty } from '@nestjs/swagger';
import { IsNumberString } from 'class-validator';

export class DeleteCityVisitDto {
  @ApiProperty()
  @IsNumberString()
  cityId: number;
}
