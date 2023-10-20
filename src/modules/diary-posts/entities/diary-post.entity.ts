import { ApiProperty } from '@nestjs/swagger';
import { DiaryPost } from '@prisma/client';

export class DiaryPostEntity implements DiaryPost {
  @ApiProperty()
  id: number;

  @ApiProperty()
  title: string;

  @ApiProperty()
  message: string;

  @ApiProperty()
  userId: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  tripDiaryId: number;
}
