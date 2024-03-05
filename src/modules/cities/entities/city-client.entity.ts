import { ApiProperty } from '@nestjs/swagger';
import { CityEntity } from 'src/modules/cities/entities/city.entity';
import { CityVisitEntity } from 'src/modules/city-visits/entities/city-visit.entity';
import { MediaEntity } from 'src/modules/media/entities/media.entity';

export class CityClientEntity extends CityEntity {
  @ApiProperty()
  isInterested: boolean;

  @ApiProperty({ type: CityVisitEntity })
  userVisit: CityVisitEntity | null;

  @ApiProperty({ type: MediaEntity, isArray: true })
  images: MediaEntity[];

  constructor(partial: CityEntity) {
    super(partial);
    Object.assign(this, partial);
  }
}
