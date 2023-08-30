import { Injectable } from '@nestjs/common';
import { CreateTipCommentDto } from './dto/create-tip-comment.dto';
import { UpdateTipCommentDto } from './dto/update-tip-comment.dto';

@Injectable()
export class TipCommentsService {
  create(createTipCommentDto: CreateTipCommentDto) {
    return 'This action adds a new tipComment';
  }

  findAll() {
    return `This action returns all tipComments`;
  }

  findOne(id: number) {
    return `This action returns a #${id} tipComment`;
  }

  update(id: number, updateTipCommentDto: UpdateTipCommentDto) {
    return `This action updates a #${id} tipComment`;
  }

  remove(id: number) {
    return `This action removes a #${id} tipComment`;
  }
}
