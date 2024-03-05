import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateCityVisitDto } from 'src/modules/city-visits/dtos/create-city-visit.dto';

export class UpdateCityVisitDto extends PartialType(CreateCityVisitDto) {
  @ApiProperty()
  cityId: number;
}
