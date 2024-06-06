import { ApiProperty } from '@nestjs/swagger';
import { CityEntity } from '../../cities/entities/city.entity';
import { CityVisitClientDto } from './city-visit-client.dto';

export class CountryCityVisitDto extends CityVisitClientDto {
  @ApiProperty({ type: CityEntity })
  city: CityEntity;
}
