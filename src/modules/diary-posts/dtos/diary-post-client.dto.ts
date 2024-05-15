import { ApiProperty } from '@nestjs/swagger';
import { DiaryPostEntity } from 'src/modules/diary-posts/entities/diary-post.entity';

export class DiaryPostClientDto extends DiaryPostEntity {
  @ApiProperty()
  likesAmount: number;

  @ApiProperty()
  isLiked: boolean;
}
