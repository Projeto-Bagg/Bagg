import { ApiProperty } from '@nestjs/swagger';
import { PaginationDto } from 'src/commons/entities/pagination';

export class FindUserByCountryDto extends PaginationDto {
  @ApiProperty()
  countryIso2: string;
}
