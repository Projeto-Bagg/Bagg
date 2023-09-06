import { ApiProperty } from '@nestjs/swagger';

export class TripDiary {
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
}
