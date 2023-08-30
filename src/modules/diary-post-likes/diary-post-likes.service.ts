import { Injectable } from '@nestjs/common';
import { CreateDiaryPostLikeDto } from './dto/create-diary-post-like.dto';
import { UpdateDiaryPostLikeDto } from './dto/update-diary-post-like.dto';

@Injectable()
export class DiaryPostLikesService {
  create(createDiaryPostLikeDto: CreateDiaryPostLikeDto) {
    return 'This action adds a new diaryPostLike';
  }

  findAll() {
    return `This action returns all diaryPostLikes`;
  }

  findOne(id: number) {
    return `This action returns a #${id} diaryPostLike`;
  }

  update(id: number, updateDiaryPostLikeDto: UpdateDiaryPostLikeDto) {
    return `This action updates a #${id} diaryPostLike`;
  }

  remove(id: number) {
    return `This action removes a #${id} diaryPostLike`;
  }
}
