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
import { IsPublic } from 'src/modules/auth/decorators/is-public.decorator';
import { UserClientDto } from 'src/modules/users/dtos/user-client.dto';
import { PaginationDto } from 'src/commons/entities/pagination';
import { CreateDiaryPostReportDto } from 'src/modules/diary-posts/dtos/create-diary-post-report.dto';
import { DiaryPostClientDto } from 'src/modules/diary-posts/dtos/diary-post-client.dto';

@Controller('diary-posts')
@ApiTags('diary posts')
export class DiaryPostsController {
  constructor(private readonly diaryPostsService: DiaryPostsService) {}

  @Post()
  @UseInterceptors(FilesInterceptor('medias'), ClassSerializerInterceptor)
  @ApiConsumes('multipart/form-data')
  @ApiResponse({ type: DiaryPostClientDto })
  async create(
    @Body() createDiaryPostDto: CreateDiaryPostDto,
    @UploadedFiles() medias: Express.Multer.File[],
    @CurrentUser() currentUser: UserFromJwt,
  ): Promise<DiaryPostClientDto> {
    const post = await this.diaryPostsService.create(
      createDiaryPostDto,
      medias,
      currentUser,
    );

    return new DiaryPostClientDto(post);
  }

  @Get('/user/:username')
  @IsPublic()
  @ApiResponse({ type: DiaryPostClientDto, isArray: true })
  @ApiBearerAuth()
  @UseInterceptors(ClassSerializerInterceptor)
  async getByUser(
    @Param('username') username: string,
    @Query() query: PaginationDto,
    @CurrentUser() currentUser: UserFromJwt,
  ): Promise<DiaryPostClientDto[]> {
    const posts = await this.diaryPostsService.findByUsername(
      username,
      query.page,
      query.count,
      currentUser,
    );

    return posts.map((post) => {
      return new DiaryPostClientDto(post);
    });
  }

  @Get(':id')
  @IsPublic()
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiBearerAuth()
  @ApiResponse({ type: DiaryPostClientDto, status: 200 })
  @ApiResponse({ status: 404, description: 'Diary post does not exist' })
  async getById(
    @Param('id') id: number,
    @CurrentUser() currentUser: UserFromJwt,
  ): Promise<DiaryPostClientDto> {
    const post = await this.diaryPostsService.findById(id, currentUser);

    return new DiaryPostClientDto(post);
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
    return await this.diaryPostsService.likedBy(id, currentUser);
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
