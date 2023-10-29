import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TripDiary } from '@prisma/client';
import { UserEntity } from 'src/modules/users/entities/user.entity';

export class TripDiaryEntity implements TripDiary {
  @ApiProperty()
  id: number;

  @ApiProperty()
  title: string;

  @ApiProperty()
  message: string;

  @ApiProperty()
  userId: number;

  @ApiPropertyOptional({ type: UserEntity })
  User?: UserEntity;

  @ApiProperty()
  createdAt: Date;
}
