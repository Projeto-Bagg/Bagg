import { ApiProperty } from '@nestjs/swagger';
import { PaginationDto } from 'src/commons/entities/pagination';

export class FindUserByCityDto extends PaginationDto {
  @ApiProperty()
  cityId: number;
}
