import { PartialType } from '@nestjs/swagger';
import { CreateTipLikeDto } from './create-tip-like.dto';

export class UpdateTipLikeDto extends PartialType(CreateTipLikeDto) {}
