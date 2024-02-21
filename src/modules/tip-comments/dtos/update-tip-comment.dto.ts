import { PartialType } from '@nestjs/swagger';
import { CreateTipCommentDto } from './create-tip-comment.dto';

export class UpdateTipCommentDto extends PartialType(CreateTipCommentDto) {}
