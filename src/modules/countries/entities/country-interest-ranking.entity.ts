import { ApiProperty } from '@nestjs/swagger';
import { CountryEntity } from 'src/modules/countries/entities/country.entity';

export class CountryInterestRankingEntity {
  @ApiProperty({
    type: CountryEntity,
  })
  country: CountryEntity;

  @ApiProperty()
  interestedUsersAmount: number;
}
