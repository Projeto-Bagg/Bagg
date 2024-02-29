import { ApiProperty } from '@nestjs/swagger';
import { MediaEntity } from 'src/modules/media/entities/media.entity';

export class TipMediaEntity extends MediaEntity {
  @ApiProperty()
  tipId: number;
}
