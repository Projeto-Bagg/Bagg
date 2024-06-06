import { ApiProperty } from '@nestjs/swagger';
import { PaginationDto } from 'src/commons/entities/pagination';

export class CountrySearchDto extends PaginationDto {
  @ApiProperty()
  q: string;
}
