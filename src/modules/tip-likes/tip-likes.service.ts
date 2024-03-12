import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserFromJwt } from 'src/modules/auth/models/UserFromJwt';

@Injectable()
export class TipLikesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(tipId: number, currentUser: UserFromJwt): Promise<void> {
    await this.prisma.tipLike.create({
      data: {
        user: {
          connect: { id: currentUser.id },
        },
        tip: {
          connect: { id: tipId },
        },
      },
    });
  }

  async remove(tipId: number, currentUser: UserFromJwt): Promise<void> {
    await this.prisma.tipLike.delete({
      where: {
        userId_tipId: {
          tipId,
          userId: currentUser.id,
        },
      },
    });
  }
}
