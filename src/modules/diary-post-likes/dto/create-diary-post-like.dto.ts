import { ApiProperty } from '@nestjs/swagger';

export class CreateDiaryPostLikeDto {
  @ApiProperty()
  userId: number;

  @ApiProperty()
  postId: number;

  @ApiProperty()
  tipId: number;
}
