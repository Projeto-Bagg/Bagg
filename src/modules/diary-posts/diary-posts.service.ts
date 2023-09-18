import { Injectable } from '@nestjs/common';
import { CreateDiaryPostDto } from './dto/create-diary-post.dto';
import { UpdateDiaryPostDto } from './dto/update-diary-post.dto';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class DiaryPostsService {
  constructor(private readonly prisma: PrismaService) {}

  create(CreateDiaryPostDto: CreateDiaryPostDto) {
    return this.prisma.diaryPost.create({ data: CreateDiaryPostDto });
  }

  findMany() {
    return this.prisma.diaryPost.findMany();
  }

  findUnique(id: number) {
    return this.prisma.diaryPost.findUnique({ where: { id } });
  }

  update(id: number, UpdateDiaryPostDto: UpdateDiaryPostDto) {
    return this.prisma.diaryPost.update({
      where: { id },
      data: UpdateDiaryPostDto,
    });
  }

  delete(id: number) {
    return this.prisma.diaryPost.delete({ where: { id } });
  }
}
