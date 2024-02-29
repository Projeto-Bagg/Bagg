import { ApiProperty } from '@nestjs/swagger';
import { CityEntity } from 'src/modules/cities/entities/city.entity';
import { MediaEntity } from 'src/modules/media/entities/media.entity';

export class CityClientEntity extends CityEntity {
  @ApiProperty()
  isInterested: boolean;

  @ApiProperty()
  isVisited: boolean;

  @ApiProperty({ type: MediaEntity, isArray: true })
  images: MediaEntity[];

  constructor(partial: CityEntity) {
    super(partial);
    Object.assign(this, partial);
  }
}
