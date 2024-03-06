import { ApiProperty } from '@nestjs/swagger';
import { CityClientEntity } from 'src/modules/cities/entities/city-client.entity';
import { CityVisitClientDto } from 'src/modules/city-visits/dtos/city-visit-client.dto';

export class CityPageDto extends CityClientEntity {
  @ApiProperty({ type: CityVisitClientDto, isArray: true })
  visits: CityVisitClientDto[];

  @ApiProperty()
  averageRating: number;

  @ApiProperty()
  visitsCount: number;

  @ApiProperty()
  interestsCount: number;

  constructor(partial: CityPageDto) {
    super(partial);
    Object.assign(this, partial);
  }
}
