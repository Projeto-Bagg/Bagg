import { ApiProperty } from '@nestjs/swagger';
import { RegionEntity } from 'src/modules/regions/entities/region.entity';

export class CityVisitRankingEntity {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  totalVisit: number;

  @ApiProperty({ type: RegionEntity })
  region: RegionEntity;
}
