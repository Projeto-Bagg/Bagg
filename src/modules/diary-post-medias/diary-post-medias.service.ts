import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateDiaryPostMediaDto } from './dtos/create-diary-post-media.dto';

@Injectable()
export class DiaryPostMediasService {
  constructor(private readonly prisma: PrismaService) {}

  create(createDiaryPostMediaDto: CreateDiaryPostMediaDto) {
    return this.prisma.diaryPostMedia.create({
      data: createDiaryPostMediaDto,
    });
  }

  remove(id: number) {
    return this.prisma.country.delete({ where: { id: id } });
  }
}
