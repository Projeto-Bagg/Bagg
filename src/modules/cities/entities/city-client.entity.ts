import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { CityEntity } from 'src/modules/cities/entities/city.entity';
import { CityInterestEntity } from 'src/modules/city-interests/entities/city-interest.entity';
import { CityVisitEntity } from 'src/modules/city-visits/entities/city-visit.entity';

export class CityClientEntity extends CityEntity {
  @ApiProperty()
  isInterested: boolean;

  @ApiProperty()
  isVisited: boolean;

  @Exclude()
  cityInterests: CityInterestEntity[];

  @Exclude()
  cityVisits: CityVisitEntity[];

  constructor(partial: CityEntity) {
    super(partial);
    Object.assign(this, partial);
  }
}
