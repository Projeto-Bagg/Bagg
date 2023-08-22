import { ApiProperty } from '@nestjs/swagger';

export class CreatePostDto {
  @ApiProperty()
  title: string;

  @ApiProperty()
  videoUrl: string;

  @ApiProperty()
  thumbnailUrl: string;

  @ApiProperty()
  userId: string;
}
