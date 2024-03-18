import { ApiProperty } from '@nestjs/swagger';
import { CityEntity } from 'src/modules/cities/entities/city.entity';

export class CityInterestRankingDto extends CityEntity {
  @ApiProperty()
  totalInterest: number;

  @ApiProperty()
  iso2: string;

  @ApiProperty()
  region: string;

  @ApiProperty()
  country: string;
}
