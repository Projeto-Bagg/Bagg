import { Injectable } from '@nestjs/common';
import { CreateDiaryPostDto } from './dto/create-diary-post.dto';
import { PrismaService } from '../../prisma/prisma.service';
import { UserFromJwt } from 'src/modules/auth/models/UserFromJwt';

@Injectable()
export class DiaryPostsService {
  constructor(private readonly prisma: PrismaService) {}

  create(createDiaryPostDto: CreateDiaryPostDto, currentUser: UserFromJwt) {
    return this.prisma.diaryPost.create({
      data: {
        title: createDiaryPostDto.title,
        message: createDiaryPostDto.message,
        tripDiary: {
          connect: {
            id: createDiaryPostDto.tripDiaryId,
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

  findMany() {
    return this.prisma.diaryPost.findMany();
  }
}
