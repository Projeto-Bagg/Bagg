import { Injectable } from '@nestjs/common';
import { CreateTipLikeDto } from './dto/create-tip-like.dto';
import { UpdateTipLikeDto } from './dto/update-tip-like.dto';

@Injectable()
export class TipLikesService {
  create(createTipLikeDto: CreateTipLikeDto) {
    return 'This action adds a new tipLike';
  }

  findAll() {
    return `This action returns all tipLikes`;
  }

  findOne(id: number) {
    return `This action returns a #${id} tipLike`;
  }

  update(id: number, updateTipLikeDto: UpdateTipLikeDto) {
    return `This action updates a #${id} tipLike`;
  }

  remove(id: number) {
    return `This action removes a #${id} tipLike`;
  }
}
