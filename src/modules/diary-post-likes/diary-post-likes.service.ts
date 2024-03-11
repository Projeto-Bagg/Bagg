import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserFromJwt } from 'src/modules/auth/models/UserFromJwt';

@Injectable()
export class DiaryPostLikesService {
  constructor(private readonly prisma: PrismaService) {}

  async like(id: number, currentUser: UserFromJwt): Promise<void> {
    await this.prisma.diaryPostLike.create({
      data: {
        diaryPost: {
          connect: {
            id,
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

  async unlike(id: number, currentUser: UserFromJwt): Promise<void> {
    await this.prisma.diaryPostLike.delete({
      where: {
        userId_diaryPostId: {
          diaryPostId: id,
          userId: currentUser.id,
        },
      },
    });
  }
}
