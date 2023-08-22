import { ApiProperty } from '@nestjs/swagger';

export class Post {
  @ApiProperty()
  id: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  videoUrl: string;

  @ApiProperty()
  thumbnailUrl: string;

  @ApiProperty()
  commentsAmount: number;

  @ApiProperty()
  userId: string;

  @ApiProperty()
  createdAt: Date;
}
