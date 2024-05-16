import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateCityVisitDto } from './create-city-visit.dto';

export class UpdateCityVisitDto extends PartialType(CreateCityVisitDto) {
  @ApiProperty()
  cityId: number;
}
