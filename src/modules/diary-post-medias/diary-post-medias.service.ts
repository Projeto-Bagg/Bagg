import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateDiaryPostMediaDto } from './dtos/create-diary-post-media.dto';
import { DiaryPostMediaEntity } from 'src/modules/diary-post-medias/entities/diary-post-media.entity';

@Injectable()
export class DiaryPostMediasService {
  constructor(private readonly prisma: PrismaService) {}

  create(
    createDiaryPostMediaDto: CreateDiaryPostMediaDto,
  ): Promise<DiaryPostMediaEntity> {
    return this.prisma.diaryPostMedia.create({
      data: createDiaryPostMediaDto,
    });
  }

  async remove(id: number): Promise<void> {
    await this.prisma.country.delete({ where: { id: id } });
  }
}
