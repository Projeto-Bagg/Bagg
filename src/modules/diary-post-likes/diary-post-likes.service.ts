import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateDiaryPostLikeDto } from './dto/create-diary-post-like.dto';
import { UserFromJwt } from 'src/modules/auth/models/UserFromJwt';
import { DeleteDiaryPostLikeDto } from 'src/modules/diary-post-likes/dto/delete-diary-post-like';

@Injectable()
export class DiaryPostLikesService {
  constructor(private readonly prisma: PrismaService) {}

  async like(
    createDiaryPostLikeDto: CreateDiaryPostLikeDto,
    currentUser: UserFromJwt,
  ): Promise<void> {
    await this.prisma.diaryPostLike.create({
      data: {
        diaryPost: {
          connect: {
            id: createDiaryPostLikeDto.postId,
          },
        },
        user: {
          connect: {
            id: currentUser.id,
          },
        },
      },
    });
  }

  async unlike(
    deleteDiaryPostLikeDto: DeleteDiaryPostLikeDto,
    currentUser: UserFromJwt,
  ): Promise<void> {
    await this.prisma.diaryPostLike.delete({
      where: {
        userId_diaryPostId: {
          diaryPostId: deleteDiaryPostLikeDto.postId,
          userId: currentUser.id,
        },
      },
    });
  }
}
