import { ApiProperty } from '@nestjs/swagger';
import { CityEntity } from 'src/modules/cities/entities/city.entity';

export class CityByDistanceDto extends CityEntity {
  @ApiProperty({ type: Number })
  distance: number;

  constructor(partial: CityByDistanceDto) {
    super();
    Object.assign(this, partial);
  }
}
