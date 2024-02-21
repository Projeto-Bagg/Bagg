import { PartialType } from '@nestjs/swagger';
import { CreateTipMediaDto } from './create-tip-media.dto';

export class UpdateTipMediaDto extends PartialType(CreateTipMediaDto) {}
