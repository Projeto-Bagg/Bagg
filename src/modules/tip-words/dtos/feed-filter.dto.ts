import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsString, MaxLength } from 'class-validator';

export class FeedFilterDto {
  @ApiPropertyOptional()
  follows?: boolean;

  @ApiPropertyOptional()
  cityInterest?: boolean;

  @ApiPropertyOptional()
  relevancy?: boolean;
}
