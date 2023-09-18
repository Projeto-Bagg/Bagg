import { ApiProperty } from '@nestjs/swagger';
import { DiaryPostMedia } from '@prisma/client';

export class DiaryPostMediaEntity implements DiaryPostMedia {
  @ApiProperty()
  id: number;

  @ApiProperty()
  url: string;

  @ApiProperty()
  diaryPostId: number;

  @ApiProperty()
  createdAt: Date;
}
