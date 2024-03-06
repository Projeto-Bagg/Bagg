import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber } from 'class-validator';

export class DeleteCityVisitDto {
  @ApiProperty()
  @Type(() => Number)
  @IsNumber()
  cityId: number;
}
