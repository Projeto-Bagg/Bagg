import { ApiProperty } from '@nestjs/swagger';
import { CityClientEntity } from 'src/modules/cities/entities/city-client.entity';
import { CityVisitEntity } from 'src/modules/city-visits/entities/city-visit.entity';

export class CityPageEntity extends CityClientEntity {
  @ApiProperty({ type: CityVisitEntity, isArray: true })
  visits: CityVisitEntity[];

  constructor(partial: CityPageEntity) {
    super(partial);
    Object.assign(this, partial);
  }
}
