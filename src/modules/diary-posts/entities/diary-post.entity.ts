import { ApiProperty } from '@nestjs/swagger';
import { DiaryPost, DiaryPostLike } from '@prisma/client';
import { Exclude } from 'class-transformer';
import { DiaryPostMediaEntity } from 'src/modules/diary-post-medias/entities/diary-post-media.entity';
import { TripDiaryEntity } from 'src/modules/trip-diaries/entities/trip-diary.entity';
import { UserEntity } from 'src/modules/users/entities/user.entity';

export class DiaryPostEntity implements DiaryPost {
  @ApiProperty()
  id: number;

  @ApiProperty()
  message: string;

  @ApiProperty()
  userId: number;

  @ApiProperty()
  user: UserEntity;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  tripDiaryId: number;

  @ApiProperty()
  tripDiary: TripDiaryEntity;

  @Exclude()
  softDelete: boolean;

  @Exclude()
  status: string;

  @Exclude()
  likedBy: DiaryPostLike[];

  @ApiProperty({ type: DiaryPostMediaEntity, isArray: true })
  diaryPostMedias: DiaryPostMediaEntity[];

  constructor(partial: DiaryPostEntity) {
    Object.assign(this, partial);
  }
}
