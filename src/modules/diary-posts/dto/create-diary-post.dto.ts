import { ApiProperty } from '@nestjs/swagger';
import { MaxLength } from 'class-validator';

export class CreateDiaryPostDto {
  @ApiProperty()
  @MaxLength(300)
  message: string;

  @ApiProperty()
  tripDiaryId: number;
}
