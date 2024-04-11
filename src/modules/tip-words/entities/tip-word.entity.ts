import { ApiProperty } from '@nestjs/swagger';
import { Tip, TipWord } from '@prisma/client';
import { TipEntity } from 'src/modules/tips/entities/tip.entity';

export class TipWordEntity implements TipWord {
  @ApiProperty()
  id: number;

  @ApiProperty()
  word: string;

  @ApiProperty({ type: TipEntity })
  tip: Tip;

  @ApiProperty()
  tipId: number;

  @ApiProperty()
  createdAt: Date;
}
