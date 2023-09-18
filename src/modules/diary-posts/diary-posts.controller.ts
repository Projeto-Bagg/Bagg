import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { DiaryPostsService } from './diary-posts.service';
import { CreateDiaryPostDto } from './dto/create-diary-post.dto';
import { UpdateDiaryPostDto } from './dto/update-diary-post.dto';
import { ApiTags } from '@nestjs/swagger';

@Controller('diary-posts')
@ApiTags('diary posts')
export class DiaryPostsController {
  constructor(private readonly diaryPostsService: DiaryPostsService) {}

  @Post()
  create(@Body() createDiaryPostDto: CreateDiaryPostDto) {
    return this.diaryPostsService.create(createDiaryPostDto);
  }

  @Get()
  findAll() {
    return this.diaryPostsService.findMany();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.diaryPostsService.findUnique(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: number,
    @Body() UpdateDiaryPostDto: UpdateDiaryPostDto,
  ) {
    return this.diaryPostsService.update(id, UpdateDiaryPostDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.diaryPostsService.delete(id);
  }
}
