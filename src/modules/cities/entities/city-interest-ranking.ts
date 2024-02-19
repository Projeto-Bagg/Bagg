import { ApiProperty } from '@nestjs/swagger';
import { CountryEntity } from 'src/modules/countries/entities/country.entity';

export class CountryRankingEntity {
  @ApiProperty({
    type: CountryEntity,
  })
  country: CountryEntity;

  @ApiProperty()
  interestedUsersAmount: number;
}
