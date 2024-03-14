import { ApiProperty } from '@nestjs/swagger';
import { CityEntity } from 'src/modules/cities/entities/city.entity';
import { CityVisitEntity } from 'src/modules/city-visits/entities/city-visit.entity';

export class CityPageDto extends CityEntity {
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

  constructor(partial: CityPageDto) {
    super();
    Object.assign(this, partial);
  }
}
