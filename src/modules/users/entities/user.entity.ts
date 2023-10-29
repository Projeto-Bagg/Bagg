import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { User } from '@prisma/client';
import { Exclude } from 'class-transformer';
import { CityEntity } from 'src/modules/cities/entities/city.entity';

export class UserEntity implements User {
  @ApiProperty()
  id: number;

  @ApiProperty()
  fullName: string;

  @ApiProperty()
  username: string;

  @Exclude()
  email: string;

  @ApiProperty()
  bio: string | null;

  @Exclude()
  emailVerified: boolean;

  @ApiProperty()
  birthdate: Date;

  @ApiProperty()
  image: string | null;

  @Exclude()
  password: string;

  @ApiPropertyOptional({ type: CityEntity })
  city?: CityEntity;

  @ApiPropertyOptional()
  cityId: number | null;

  @ApiProperty()
  createdAt: Date;

  constructor(partial: UserEntity) {
    Object.assign(this, partial);
  }
}
