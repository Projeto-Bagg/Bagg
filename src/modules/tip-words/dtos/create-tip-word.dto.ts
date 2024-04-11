import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsString, MaxLength } from 'class-validator';

export class CreateTipWordDto {
  @ApiProperty()
  @IsString()
  @MaxLength(300)
  word: string;

  @ApiProperty()
  @Type(() => Number)
  tipId: number;
}
