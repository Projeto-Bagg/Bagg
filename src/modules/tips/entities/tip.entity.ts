import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Tip } from '@prisma/client';
import { CityRegionCountryDto } from 'src/modules/cities/dtos/city-region-country.dto';
import { TipMediaEntity } from 'src/modules/tip-medias/entities/tip-media.entity';
import { UserEntity } from 'src/modules/users/entities/user.entity';

export class TipEntity implements Tip {
  @ApiProperty()
  id: number;

  @ApiProperty()
  message: string;

  @ApiProperty()
  userId: number;

  @ApiProperty()
  cityId: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty({ type: UserEntity })
  user: UserEntity;

  @ApiProperty({ type: TipMediaEntity, isArray: true })
  tipMedias: TipMediaEntity[];

  @ApiProperty()
  likedBy: number;

  @ApiPropertyOptional()
  tags: string | null;

  @ApiProperty()
  isLiked: boolean;

  @ApiProperty()
  commentsAmount: number;

  @ApiProperty({ type: CityRegionCountryDto })
  city: CityRegionCountryDto;

  constructor(partial: TipEntity) {
    Object.assign(this, { ...partial, user: new UserEntity(partial.user) });
  }
}
