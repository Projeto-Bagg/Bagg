import { ApiProperty } from '@nestjs/swagger';

export class CreateDiaryPostLikeDto {
  @ApiProperty()
  postId: number;
}
