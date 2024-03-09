import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsString } from 'class-validator';

export class CreateTipDto {
  @ApiProperty()
  @IsString()
  message: string;

  @ApiProperty()
  @Type(() => Number)
  cityId: number;
}
