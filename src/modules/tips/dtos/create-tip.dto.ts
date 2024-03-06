import { ApiProperty } from '@nestjs/swagger';

export class CreateTipDto {
  @ApiProperty()
  title: string;

  @ApiProperty()
  message: string;

  @ApiProperty()
  cityId: number;
}
