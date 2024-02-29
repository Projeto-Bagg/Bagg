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
import { DiaryPostLikesService } from 'src/modules/diary-post-likes/diary-post-likes.service';

@Controller('diaryPosts')
@ApiTags('diary posts')
export class DiaryPostsController {
  constructor(
    private readonly diaryPostsService: DiaryPostsService,
    private readonly diaryPostLikeService: DiaryPostLikesService,
  ) {}

  @Post()
  @UseInterceptors(FilesInterceptor('medias'))
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

    return { ...post, user: new UserClientDto(post.user) };
  }

  @Get('user/feed')
  @IsPublic()
  @ApiBearerAuth()
  @ApiResponse({ type: DiaryPostEntity, isArray: true })
  @UseInterceptors(ClassSerializerInterceptor)
  async feed(
    @CurrentUser() currentUser: UserFromJwt,
  ): Promise<DiaryPostEntity[]> {
    const posts = await this.diaryPostsService.feedFollowedByCurrentUser(
      currentUser,
    );

    return posts.map((post) => {
      return {
        ...post,
        user: new UserClientDto(post.user),
      };
    });
  }

  @Get('/user/:username')
  @IsPublic()
  @ApiResponse({ type: DiaryPostEntity, isArray: true })
  @ApiBearerAuth()
  @UseInterceptors(ClassSerializerInterceptor)
  async getByUser(
    @Param('username') username: string,
    @CurrentUser() currentUser: UserFromJwt,
  ): Promise<DiaryPostEntity[]> {
    const posts = await this.diaryPostsService.findByUsername(
      username,
      currentUser,
    );

    return posts.map((post) => {
      return {
        ...post,
        user: new UserClientDto(post.user),
      };
    });
  }

  @Get('user/:username/feed/like')
  @IsPublic()
  @ApiBearerAuth()
  @ApiResponse({ type: DiaryPostEntity, isArray: true })
  @UseInterceptors(ClassSerializerInterceptor)
  async userLikedPostsFeed(
    @Param('username') username: string,
    @CurrentUser() currentUser: UserFromJwt,
  ): Promise<DiaryPostEntity[]> {
    const posts = await this.diaryPostsService.feedLikedByUser(
      username,
      currentUser,
    );

    return posts.map((post) => {
      return {
        ...post,
        user: new UserClientDto(post.user),
      };
    });
  }

  @Get(':id')
  @IsPublic()
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiBearerAuth()
  @ApiResponse({ type: DiaryPostEntity })
  getById(
    @Param('id') id: number,
    @CurrentUser() currentUser: UserFromJwt,
  ): Promise<DiaryPostEntity> {
    return this.diaryPostsService.findById(id, currentUser);
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

  @Post(':id/like')
  @ApiBearerAuth()
  like(
    @Param('id') id: number,
    @CurrentUser() currentUser: UserFromJwt,
  ): Promise<void> {
    return this.diaryPostLikeService.like({ postId: id }, currentUser);
  }

  @Post(':id/unlike')
  @ApiBearerAuth()
  unlike(
    @Param('id') id: number,
    @CurrentUser() currentUser: UserFromJwt,
  ): Promise<void> {
    return this.diaryPostLikeService.unlike({ postId: id }, currentUser);
  }

  @Delete(':id')
  @ApiBearerAuth()
  delete(
    @Param('id') id: number,
    @CurrentUser() currentUser: UserFromJwt,
  ): Promise<void> {
    return this.diaryPostsService.delete(id, currentUser);
  }

  @Get()
  @ApiResponse({ type: DiaryPostEntity, isArray: true })
  @ApiBearerAuth()
  findAll(@CurrentUser() currentUser: UserFromJwt): Promise<DiaryPostEntity[]> {
    return this.diaryPostsService.findMany(currentUser);
  }
}
