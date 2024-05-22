import { ApiProperty } from '@nestjs/swagger';
import { PaginationDto } from 'src/commons/entities/pagination';

export class CitySearchDto extends PaginationDto {
  @ApiProperty()
  q: string;
}
