import { ApiProperty } from '@nestjs/swagger';
import { CityRegionCountryEntity } from 'src/modules/cities/entities/city-region-country.entity';
import { TripDiaryEntity } from 'src/modules/trip-diaries/entities/trip-diary.entity';

export class TripDiaryClientEntity extends TripDiaryEntity {
  @ApiProperty({ type: CityRegionCountryEntity })
  city: CityRegionCountryEntity;
}
