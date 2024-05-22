import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Tip, TipLike } from '@prisma/client';
import { Exclude } from 'class-transformer';
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

  @Exclude()
  likedBy: TipLike[];

  @ApiPropertyOptional({ type: String })
  tags: string | null;

  @ApiProperty()
  commentsAmount: number;

  @ApiProperty({ type: CityRegionCountryDto })
  city: CityRegionCountryDto;

  @Exclude()
  softDelete: boolean;

  @Exclude()
  status: string;

  constructor(partial: TipEntity) {
    Object.assign(this, partial);
  }
}
