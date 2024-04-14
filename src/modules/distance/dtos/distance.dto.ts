import { ApiProperty } from '@nestjs/swagger';

export class DistanceDto {
  @ApiProperty({ type: Number })
  distance: number;
}
