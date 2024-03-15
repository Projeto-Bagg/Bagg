import { ApiProperty } from '@nestjs/swagger';
import { CountryEntity } from 'src/modules/countries/entities/country.entity';

export class CountryPageDto extends CountryEntity {
  @ApiProperty({ type: Number })
  averageRating: number | null;

  @ApiProperty()
  visitsCount: number;

  @ApiProperty()
  interestsCount: number;
}
