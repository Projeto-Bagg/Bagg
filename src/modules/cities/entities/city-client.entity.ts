import { ApiProperty } from '@nestjs/swagger';
import { CityEntity } from 'src/modules/cities/entities/city.entity';

export class CityClientEntity extends CityEntity {
  @ApiProperty()
  isInterested: boolean;

  @ApiProperty()
  isVisited: boolean;

  constructor(partial: CityEntity) {
    super(partial);
    Object.assign(this, partial);
  }
}
