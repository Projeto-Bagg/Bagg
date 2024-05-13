import {
  Controller,
  Get,
  Post,
  Body,
  UploadedFiles,
  UseInterceptors,
  Param,
  ClassSerializerInterceptor,
  Delete,
  Query,
} from '@nestjs/common';
import { DiaryPostsService } from './diary-posts.service';
import { CreateDiaryPostDto } from './dtos/create-diary-post.dto';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CurrentUser } from 'src/modules/auth/decorators/current-user.decorator';
import { UserFromJwt } from 'src/modules/auth/models/UserFromJwt';
import { FilesInterceptor } from '@nestjs/platform-express';
import { DiaryPostEntity } from 'src/modules/diary-posts/entities/diary-post.entity';
import { IsPublic } from 'src/modules/auth/decorators/is-public.decorator';
import { UserClientDto } from 'src/modules/users/dtos/user-client.dto';
import { PaginationDto } from 'src/commons/entities/pagination';
import { CreateDiaryPostReportDto } from 'src/modules/diary-posts/dtos/create-diary-post-report.dto';

@Controller('diary-posts')
@ApiTags('diary posts')
export class DiaryPostsController {
  constructor(private readonly diaryPostsService: DiaryPostsService) {}

  @Post()
  @UseInterceptors(FilesInterceptor('medias'), ClassSerializerInterceptor)
  @ApiConsumes('multipart/form-data')
  @ApiResponse({ type: DiaryPostEntity })
  async create(
    @Body() createDiaryPostDto: CreateDiaryPostDto,
    @UploadedFiles() medias: Express.Multer.File[],
    @CurrentUser() currentUser: UserFromJwt,
  ): Promise<DiaryPostEntity> {
    const post = await this.diaryPostsService.create(
      createDiaryPostDto,
      medias,
      currentUser,
    );

    return new DiaryPostEntity(post);
  }

  @Get('/user/:username')
  @IsPublic()
  @ApiResponse({ type: DiaryPostEntity, isArray: true })
  @ApiBearerAuth()
  @UseInterceptors(ClassSerializerInterceptor)
  async getByUser(
    @Param('username') username: string,
    @Query() query: PaginationDto,
    @CurrentUser() currentUser: UserFromJwt,
  ): Promise<DiaryPostEntity[]> {
    const posts = await this.diaryPostsService.findByUsername(
      username,
      query.page,
      query.count,
      currentUser,
    );

    return posts.map((post) => {
      return new DiaryPostEntity(post);
    });
  }

  @Get(':id')
  @IsPublic()
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiBearerAuth()
  @ApiResponse({ type: DiaryPostEntity, status: 200 })
  @ApiResponse({ status: 404, description: 'Diary post does not exist' })
  async getById(
    @Param('id') id: number,
    @CurrentUser() currentUser: UserFromJwt,
  ): Promise<DiaryPostEntity> {
    const post = await this.diaryPostsService.findById(id, currentUser);

    return new DiaryPostEntity(post);
  }

  @Get(':id/like')
  @ApiBearerAuth()
  @IsPublic()
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiResponse({ type: UserClientDto, isArray: true })
  async likedBy(
    @Param('id') id: number,
    @CurrentUser() currentUser: UserFromJwt,
  ): Promise<UserClientDto[]> {
    const users = await this.diaryPostsService.likedBy(id, currentUser);

    return users.map((user) => new UserClientDto(user));
  }

  @Post('report/:id')
  @ApiBearerAuth()
  report(
    @Param('id') id: number,
    @Body() createDiaryPostReport: CreateDiaryPostReportDto,
    @CurrentUser() currentUser: UserFromJwt,
  ) {
    return this.diaryPostsService.report(
      id,
      createDiaryPostReport,
      currentUser,
    );
  }

  @Delete(':id')
  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'Diary post deleted successfully' })
  @ApiResponse({ status: 401, description: 'Diary post not created by you' })
  @ApiResponse({ status: 404, description: 'Diary post does not exist' })
  delete(
    @Param('id') id: number,
    @CurrentUser() currentUser: UserFromJwt,
  ): Promise<void> {
    return this.diaryPostsService.delete(id, currentUser);
  }
}
