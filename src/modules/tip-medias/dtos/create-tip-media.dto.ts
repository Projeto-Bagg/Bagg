import { ApiProperty } from '@nestjs/swagger';

export class CreateTipMediaDto {
  @ApiProperty()
  url: string;

  @ApiProperty()
  tipId: number;
}
