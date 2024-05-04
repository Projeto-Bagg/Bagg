import { ApiProperty } from '@nestjs/swagger';
import { CityEntity } from 'src/modules/cities/entities/city.entity';
import { CityVisitClientDto } from 'src/modules/city-visits/dtos/city-visit-client.dto';

export class CountryCityVisitDto extends CityVisitClientDto {
  @ApiProperty({ type: CityEntity })
  city: CityEntity;

  constructor(partial: CityVisitClientDto) {
    super(partial);
    Object.assign(this, partial);
  }
}
