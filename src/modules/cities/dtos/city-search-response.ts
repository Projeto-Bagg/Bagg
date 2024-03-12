import { ApiProperty } from '@nestjs/swagger';
import { CityEntity } from 'src/modules/cities/entities/city.entity';

export class CitySearchResponseDto extends CityEntity {
  @ApiProperty()
  region: string;

  @ApiProperty()
  iso2: string;

  @ApiProperty()
  totalInterest: number;

  @ApiProperty()
  country: string;
}
