import {
  Controller,
  Get,
  Post,
  Body,
  UploadedFiles,
  UseInterceptors,
  Param,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { DiaryPostsService } from './diary-posts.service';
import { CreateDiaryPostDto } from './dto/create-diary-post.dto';
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
import { UserEntity } from 'src/modules/users/entities/user.entity';
import { UserClient } from 'src/modules/users/entities/user-client.entity';

@Controller('diaryPosts')
@ApiTags('diary posts')
export class DiaryPostsController {
  constructor(private readonly diaryPostsService: DiaryPostsService) {}

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

    return { ...post, user: new UserEntity(post.user) };
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
        user: new UserEntity(post.user),
      };
    });
  }

  @Get('feed')
  @IsPublic()
  @ApiBearerAuth()
  @ApiResponse({ type: DiaryPostEntity, isArray: true })
  @UseInterceptors(ClassSerializerInterceptor)
  async feed(@CurrentUser() currentUser: UserFromJwt) {
    const posts = await this.diaryPostsService.feed(currentUser);

    return posts.map((post) => {
      return {
        ...post,
        user: new UserEntity(post.user),
      };
    });
  }

  @Get(':id/like')
  @ApiBearerAuth()
  @IsPublic()
  @UseInterceptors(ClassSerializerInterceptor)
  likedBy(
    @Param('id') id: number,
    @CurrentUser() currentUser: UserFromJwt,
  ): Promise<UserClient[]> {
    return this.diaryPostsService
      .likedBy(id, currentUser)
      .then((users) => users.map((user) => new UserClient(user)));
  }

  @Post(':id/like')
  @ApiBearerAuth()
  like(
    @Param('id') id: number,
    @CurrentUser() currentUser: UserFromJwt,
  ): Promise<void> {
    console.log('autenticado');
    return this.diaryPostsService.like(id, currentUser);
  }

  @Post(':id/unlike')
  @ApiBearerAuth()
  unlike(
    @Param('id') id: number,
    @CurrentUser() currentUser: UserFromJwt,
  ): Promise<void> {
    return this.diaryPostsService.unlike(id, currentUser);
  }

  @Get()
  findAll() {
    return this.diaryPostsService.findMany();
  }
}
