import { ApiProperty } from '@nestjs/swagger';

export class DeleteDiaryPostLikeDto {
  @ApiProperty()
  postId: number;
}
