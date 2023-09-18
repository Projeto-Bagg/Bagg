import { ApiProperty } from '@nestjs/swagger';
import { TripDiary } from '@prisma/client';

export class TripDiaryEntity implements TripDiary {
  @ApiProperty()
  id: number;

  @ApiProperty()
  title: string;

  @ApiProperty()
  message: string;

  @ApiProperty()
  userId: number;

  @ApiProperty()
  diaryPostId: number;

  @ApiProperty()
  createdAt: Date;
}
