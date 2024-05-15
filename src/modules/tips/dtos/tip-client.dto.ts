import { ApiProperty } from '@nestjs/swagger';
import { TipEntity } from 'src/modules/tips/entities/tip.entity';

export class TipClientDto extends TipEntity {
  @ApiProperty()
  likesAmount: number;

  @ApiProperty()
  isLiked: boolean;
}
