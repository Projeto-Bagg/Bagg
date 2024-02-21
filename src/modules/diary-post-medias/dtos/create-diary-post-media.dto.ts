import { ApiProperty } from '@nestjs/swagger';

export class CreateDiaryPostMediaDto {
  @ApiProperty()
  url: string;

  @ApiProperty()
  diaryPostId: number;
}
