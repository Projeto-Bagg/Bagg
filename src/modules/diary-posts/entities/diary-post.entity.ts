import { ApiProperty } from '@nestjs/swagger';

export class DiaryPost {
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
}
