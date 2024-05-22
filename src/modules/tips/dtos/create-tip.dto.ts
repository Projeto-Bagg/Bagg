import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsString, MaxLength } from 'class-validator';

export class CreateTipDto {
  @ApiProperty()
  @IsString()
  @MaxLength(300)
  message: string;

  @ApiProperty()
  @Type(() => Number)
  cityId: number;

  @ApiPropertyOptional()
  tags?: string;
}
