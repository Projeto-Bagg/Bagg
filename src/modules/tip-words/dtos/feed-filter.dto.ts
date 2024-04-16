import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsBoolean, IsString, MaxLength } from 'class-validator';

export class FeedFilterDto {
  @ApiPropertyOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true')
  follows?: boolean;

  @ApiPropertyOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true')
  cityInterest?: boolean;

  @ApiPropertyOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true')
  relevancy?: boolean;
}
