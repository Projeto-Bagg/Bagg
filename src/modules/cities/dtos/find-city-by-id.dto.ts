import { ApiProperty } from '@nestjs/swagger';
import { IsNumberString } from 'class-validator';

export class FindCityById {
  @IsNumberString()
  @ApiProperty()
  id: string;
}
