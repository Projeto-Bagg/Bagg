import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserFromJwt } from 'src/modules/auth/models/UserFromJwt';

@Injectable()
export class CityInterestsService {
  constructor(private readonly prisma: PrismaService) {}

  create(cityId: number, currentUser: UserFromJwt) {
    return this.prisma.cityInterest.create({
      data: {
        cityId,
        userId: currentUser.id,
      },
    });
  }

  remove(cityId: number, currentUser: UserFromJwt) {
    return this.prisma.cityInterest.delete({
      where: {
        userId_cityId: {
          cityId,
          userId: currentUser.id,
        },
      },
    });
  }
}
