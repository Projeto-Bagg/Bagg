import { ApiProperty } from '@nestjs/swagger';
import { CityEntity } from 'src/modules/cities/entities/city.entity';

export class CityVisitRankingDto extends CityEntity {
  @ApiProperty()
  totalVisit: number;

  @ApiProperty()
  iso2: string;

  @ApiProperty()
  region: string;

  @ApiProperty()
  country: string;
}
