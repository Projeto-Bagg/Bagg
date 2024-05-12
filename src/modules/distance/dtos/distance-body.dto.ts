import { ApiProperty } from '@nestjs/swagger';

export class DistanceBodyDto {
  @ApiProperty({ type: Array<number> })
  ids: number[];
}
