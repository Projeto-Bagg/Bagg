import { ApiProperty } from '@nestjs/swagger';

export class DiaryPostMedia {
  @ApiProperty()
  id: number;

  @ApiProperty()
  url: string;

  @ApiProperty()
  diaryPostId: string;
}
