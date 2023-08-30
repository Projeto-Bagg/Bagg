import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { DiaryPostsService } from './diary-posts.service';
import { CreateDiaryPostDto } from './dto/create-diary-post.dto';
import { UpdateDiaryPostDto } from './dto/update-diary-post.dto';

@Controller('diary-posts')
export class DiaryPostsController {
  constructor(private readonly diaryPostsService: DiaryPostsService) {}

  @Post()
  create(@Body() createDiaryPostDto: CreateDiaryPostDto) {
    return this.diaryPostsService.create(createDiaryPostDto);
  }

  @Get()
  findAll() {
    return this.diaryPostsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.diaryPostsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDiaryPostDto: UpdateDiaryPostDto) {
    return this.diaryPostsService.update(+id, updateDiaryPostDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.diaryPostsService.remove(+id);
  }
}
