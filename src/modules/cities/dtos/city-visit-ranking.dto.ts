import { ApiProperty } from '@nestjs/swagger';
import { RegionEntity } from 'src/modules/regions/entities/region.entity';

export class CityVisitRankingDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  totalVisit: number;

  @ApiProperty({ type: RegionEntity })
  region: RegionEntity;
}
