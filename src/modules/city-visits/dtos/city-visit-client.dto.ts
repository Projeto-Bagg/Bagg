import { ApiProperty } from '@nestjs/swagger';
import { CityVisitEntity } from 'src/modules/city-visits/entities/city-visit.entity';
import { UserEntity } from 'src/modules/users/entities/user.entity';

export class CityVisitClientDto extends CityVisitEntity {
  @ApiProperty({ type: UserEntity })
  user: UserEntity;

  constructor(partial: CityVisitClientDto) {
    super(partial);
    Object.assign(this, partial);
  }
}
