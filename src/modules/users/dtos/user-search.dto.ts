import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UserSearchDto {
  @ApiProperty()
  q: string;

  @ApiPropertyOptional()
  page?: number;

  @ApiProperty()
  count: number;
}
