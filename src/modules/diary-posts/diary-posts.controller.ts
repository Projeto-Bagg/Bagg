import {
  Controller,
  Get,
  Post,
  Body,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { DiaryPostsService } from './diary-posts.service';
import { CreateDiaryPostDto } from './dto/create-diary-post.dto';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from 'src/modules/auth/decorators/current-user.decorator';
import { UserFromJwt } from 'src/modules/auth/models/UserFromJwt';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('diary-posts')
@ApiTags('diary posts')
export class DiaryPostsController {
  constructor(private readonly diaryPostsService: DiaryPostsService) {}

  @Post()
  @UseInterceptors(FileInterceptor('medias'))
  @ApiConsumes('multipart/form-data')
  create(
    @Body() createDiaryPostDto: CreateDiaryPostDto,
    @UploadedFiles() medias: Express.Multer.File[],
    @CurrentUser() currentUser: UserFromJwt,
  ) {
    return this.diaryPostsService.create(createDiaryPostDto, currentUser);
  }

  @Get()
  findAll() {
    return this.diaryPostsService.findMany();
  }
}
