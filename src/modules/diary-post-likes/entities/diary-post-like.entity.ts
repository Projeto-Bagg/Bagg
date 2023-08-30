import { ApiProperty } from '@nestjs/swagger';

export class DiaryPostLike {
  @ApiProperty()
  id: number;

  @ApiProperty()
  userId: number;

  @ApiProperty()
  diaryPostId: string;
}
