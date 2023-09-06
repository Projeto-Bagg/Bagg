import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateDiaryPostLikeDto } from './dto/create-diary-post-like.dto';
import { UpdateDiaryPostLikeDto } from './dto/update-diary-post-like.dto';

@Injectable()
export class DiaryPostLikesService {
  constructor(private readonly prisma: PrismaService) {}

  create(createDiaryPostLikeDto: CreateDiaryPostLikeDto) {
    return this.prisma.diaryPostLike.create({
      data: {
        user: {
          connect: { id: createDiaryPostLikeDto.userId },
        },
        post: {
          connect: { id: createDiaryPostLikeDto.postId },
        },
        tip: {
          connect: { id: createDiaryPostLikeDto.tipId },
        },
      },
    });
  }

  findAll() {
    return this.prisma.diaryPostLike.findMany();
  }

  findOne(id: number) {
    return this.prisma.diaryPostLike.findUnique({ where: { id: id } });
  }

  update(id: number, updateDiaryPostLikeDto: UpdateDiaryPostLikeDto) {
    return this.prisma.diaryPostLike.update({
      data: updateDiaryPostLikeDto,
      where: { id: id },
    });
  }

  remove(id: number) {
    return this.prisma.diaryPostLike.delete({ where: { id: id } });
  }
}
