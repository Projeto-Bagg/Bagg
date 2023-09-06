import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateDiaryPostMediaDto } from './dto/create-diary-post-media.dto';
import { UpdateDiaryPostMediaDto } from './dto/update-diary-post-media.dto';

@Injectable()
export class DiaryPostMediasService {
  constructor(private readonly prisma: PrismaService) {}

  create(createDiaryPostMediaDto: CreateDiaryPostMediaDto) {
    return this.prisma.diaryPostMedia.create({
      data: createDiaryPostMediaDto,
    });
  }

  findAll() {
    return this.prisma.diaryPostMedia.findMany();
  }

  findOne(id: number) {
    return this.prisma.diaryPostMedia.findUnique({ where: { id: id } });
  }

  update(id: number, updateDiaryPostMediaDto: UpdateDiaryPostMediaDto) {
    return this.prisma.diaryPostMedia.update({
      data: updateDiaryPostMediaDto,
      where: { id: id },
    });
  }

  remove(id: number) {
    return this.prisma.country.delete({ where: { id: id } });
  }
}
