import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { DiaryPostMediasService } from './diary-post-medias.service';
import { CreateDiaryPostMediaDto } from './dto/create-diary-post-media.dto';
import { UpdateDiaryPostMediaDto } from './dto/update-diary-post-media.dto';

@Controller('diary-post-medias')
export class DiaryPostMediasController {
  constructor(private readonly diaryPostMediasService: DiaryPostMediasService) {}

  @Post()
  create(@Body() createDiaryPostMediaDto: CreateDiaryPostMediaDto) {
    return this.diaryPostMediasService.create(createDiaryPostMediaDto);
  }

  @Get()
  findAll() {
    return this.diaryPostMediasService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.diaryPostMediasService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDiaryPostMediaDto: UpdateDiaryPostMediaDto) {
    return this.diaryPostMediasService.update(+id, updateDiaryPostMediaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.diaryPostMediasService.remove(+id);
  }
}
