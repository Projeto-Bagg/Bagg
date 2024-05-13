import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { CityEntity } from 'src/modules/cities/entities/city.entity';

class TrendingCity extends CityEntity {
  @ApiProperty()
  interestsCount: number;

  @ApiProperty()
  percentFromTotal: number;

  @ApiProperty()
  variation: number;

  @ApiProperty()
  @Type(() => Number)
  variationPercentage: number | null;
}

export class TrendingCities {
  @ApiProperty()
  totalInterest: number;

  @ApiProperty({ type: TrendingCity, isArray: true })
  cities: TrendingCity[];
}
