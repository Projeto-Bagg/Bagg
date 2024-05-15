import { ApiProperty } from '@nestjs/swagger';
import { CityVisitEntity } from '../entities/city-visit.entity';
import { UserEntity } from '../../users/entities/user.entity';

export class CityVisitClientDto extends CityVisitEntity {
  @ApiProperty({ type: UserEntity })
  user: UserEntity;

  constructor(partial: CityVisitClientDto) {
    super(partial);
    Object.assign(this, { ...partial, user: new UserEntity(partial.user) });
  }
}
