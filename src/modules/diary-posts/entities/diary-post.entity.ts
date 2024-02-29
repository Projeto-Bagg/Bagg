import { ApiProperty } from '@nestjs/swagger';
import { DiaryPost } from '@prisma/client';
import { DiaryPostMediaEntity } from 'src/modules/diary-post-medias/entities/diary-post-media.entity';
import { TripDiaryEntity } from 'src/modules/trip-diaries/entities/trip-diary.entity';
import { UserClientDto } from 'src/modules/users/dtos/user-client.dto';

export class DiaryPostEntity implements DiaryPost {
  @ApiProperty()
  id: number;

  @ApiProperty()
  message: string;

  @ApiProperty()
  userId: number;

  @ApiProperty()
  user: UserClientDto;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  tripDiaryId: number;

  @ApiProperty()
  tripDiary: TripDiaryEntity;

  @ApiProperty()
  likedBy: number;

  @ApiProperty()
  isLiked: boolean;

  @ApiProperty({ type: DiaryPostMediaEntity, isArray: true })
  diaryPostMedias: DiaryPostMediaEntity[];
}
