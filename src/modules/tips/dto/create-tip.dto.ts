import { ApiProperty } from '@nestjs/swagger';

export class CreateTipDto {
  @ApiProperty()
  userId: number;

  @ApiProperty()
  title: string;

  @ApiProperty()
  message: string;
}
