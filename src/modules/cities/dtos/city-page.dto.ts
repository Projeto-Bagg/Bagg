import { ApiProperty } from '@nestjs/swagger';
import { CityEntity } from 'src/modules/cities/entities/city.entity';
import { CityVisitClientDto } from 'src/modules/city-visits/dtos/city-visit-client.dto';
import { CityVisitEntity } from 'src/modules/city-visits/entities/city-visit.entity';
import { MediaEntity } from 'src/modules/media/entities/media.entity';

export class CityPageDto extends CityEntity {
  @ApiProperty({ type: CityVisitClientDto, isArray: true })
  visits: CityVisitClientDto[];

  @ApiProperty()
  averageRating: number;

  @ApiProperty()
  visitsCount: number;

  @ApiProperty()
  interestsCount: number;

  @ApiProperty()
  isInterested: boolean;

  @ApiProperty({ type: CityVisitEntity })
  userVisit: CityVisitEntity | null;

  @ApiProperty({ type: MediaEntity, isArray: true })
  images: MediaEntity[];

  constructor(partial: CityPageDto) {
    super();
    Object.assign(this, partial);
  }
}
