import { ApiProperty } from '@nestjs/swagger';
import { RegionEntity } from 'src/modules/regions/entities/region.entity';

export class CityInterestRankingDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  totalInterest: number;

  @ApiProperty({ type: RegionEntity })
  region: RegionEntity;
}
