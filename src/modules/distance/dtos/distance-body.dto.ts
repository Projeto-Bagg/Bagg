import { ApiProperty } from '@nestjs/swagger';

export class DistanceBodyDto {
  @ApiProperty({ type: Number, isArray: true })
  ids: number[];
}
