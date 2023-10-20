import { ApiProperty } from '@nestjs/swagger';

export class CreateDiaryPostDto {
  @ApiProperty()
  title: string;

  @ApiProperty()
  message: string;

  @ApiProperty()
  tripDiaryId: number;
}
