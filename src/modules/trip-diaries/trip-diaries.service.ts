import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTripDiaryDto } from './dto/create-trip-diary.dto';
import { UpdateTripDiaryDto } from './dto/update-trip-diary.dto';
import { UserFromJwt } from 'src/modules/auth/models/UserFromJwt';

@Injectable()
export class TripDiariesService {
  constructor(private readonly prisma: PrismaService) {}

  create(createTripDiaryDto: CreateTripDiaryDto, currentUser: UserFromJwt) {
    return this.prisma.tripDiary.create({
      data: {
        message: createTripDiaryDto.message,
        title: createTripDiaryDto.title,
        user: {
          connect: {
            id: currentUser.id,
          },
        },
      },
    });
  }

  findByUsername(username: string) {
    return this.prisma.tripDiary.findMany({
      where: {
        user: {
          username,
        },
      },
    });
  }

  findOne(id: number) {
    return this.prisma.tripDiary.findUnique({ where: { id: id } });
  }

  update(id: number, updateTripDiaryDto: UpdateTripDiaryDto) {
    return this.prisma.tripDiary.update({
      data: updateTripDiaryDto,
      where: { id: id },
    });
  }

  remove(id: number) {
    return this.prisma.tripDiary.delete({ where: { id: id } });
  }
}
