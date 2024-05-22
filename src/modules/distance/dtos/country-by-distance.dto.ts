import { ApiProperty } from '@nestjs/swagger';
import { CountryEntity } from 'src/modules/countries/entities/country.entity';

export class CountryByDistanceDto extends CountryEntity {
  @ApiProperty({ type: Number })
  distance: number;

  constructor(partial: CountryByDistanceDto) {
    super();
    Object.assign(this, partial);
  }
}

export class CountryDistanceComparedToId {
  @ApiProperty()
  id: number;

  @ApiProperty({ type: CountryByDistanceDto, isArray: true })
  places: CountryByDistanceDto[];
}
