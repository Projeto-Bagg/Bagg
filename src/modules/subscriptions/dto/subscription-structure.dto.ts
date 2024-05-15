import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsString, MaxLength } from 'class-validator';

export class CreateTipWordDto {
  @ApiProperty()
  @IsString()
  @MaxLength(70)
  userId: string;

  @ApiProperty()
  @IsString()
  subId: string;
    
  @ApiProperty()
  @Type(() => Number)
  endDate: number;
}
