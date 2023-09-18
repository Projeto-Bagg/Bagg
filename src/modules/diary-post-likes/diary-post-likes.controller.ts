import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { DiaryPostLikesService } from './diary-post-likes.service';
import { CreateDiaryPostLikeDto } from './dto/create-diary-post-like.dto';
import { UpdateDiaryPostLikeDto } from './dto/update-diary-post-like.dto';
import { ApiTags } from '@nestjs/swagger';

@Controller('diary-post-likes')
@ApiTags('diary post likes')
export class DiaryPostLikesController {
  constructor(private readonly diaryPostLikesService: DiaryPostLikesService) {}

  @Post()
  create(@Body() createDiaryPostLikeDto: CreateDiaryPostLikeDto) {
    return this.diaryPostLikesService.create(createDiaryPostLikeDto);
  }

  @Get()
  findAll() {
    return this.diaryPostLikesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.diaryPostLikesService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateDiaryPostLikeDto: UpdateDiaryPostLikeDto,
  ) {
    return this.diaryPostLikesService.update(+id, updateDiaryPostLikeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.diaryPostLikesService.remove(+id);
  }
}
