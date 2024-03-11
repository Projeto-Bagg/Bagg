import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserFromJwt } from 'src/modules/auth/models/UserFromJwt';

@Injectable()
export class TipLikesService {
  constructor(private readonly prisma: PrismaService) {}

  create(tipId: number, currentUser: UserFromJwt) {
    return this.prisma.tipLike.create({
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

  remove(tipId: number, currentUser: UserFromJwt) {
    return this.prisma.tipLike.delete({
      where: {
        userId_tipId: {
          tipId,
          userId: currentUser.id,
        },
      },
    });
  }
}
