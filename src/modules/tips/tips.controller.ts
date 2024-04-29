import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  ClassSerializerInterceptor,
  UseInterceptors,
  Query,
  UploadedFiles,
} from '@nestjs/common';
import { TipsService } from './tips.service';
import { CreateTipDto } from './dtos/create-tip.dto';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { TipEntity } from './entities/tip.entity';
import { CurrentUser } from 'src/modules/auth/decorators/current-user.decorator';
import { UserFromJwt } from 'src/modules/auth/models/UserFromJwt';
import { IsPublic } from 'src/modules/auth/decorators/is-public.decorator';
import { FilesInterceptor } from '@nestjs/platform-express';
import { UserClientDto } from 'src/modules/users/dtos/user-client.dto';
import { FeedFilterDto } from '../tip-words/dtos/feed-filter.dto';
import { PaginationDto } from 'src/commons/entities/pagination';

@Controller('tips')
@ApiTags('tips')
export class TipsController {
  constructor(private readonly tipsService: TipsService) {}

  @Post()
  @UseInterceptors(ClassSerializerInterceptor)
  @UseInterceptors(FilesInterceptor('medias'))
  @ApiConsumes('multipart/form-data')
  @ApiBearerAuth()
  @ApiResponse({ type: TipEntity })
  async create(
    @Body() createTipDto: CreateTipDto,
    @CurrentUser() currentUser: UserFromJwt,
    @UploadedFiles() medias: Express.Multer.File[],
  ): Promise<TipEntity> {
    const tip = await this.tipsService.create(
      createTipDto,
      medias,
      currentUser,
    );

    return new TipEntity(tip);
  }

  @Get('feed')
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiBearerAuth()
  @IsPublic()
  @ApiResponse({ type: TipEntity, isArray: true })
  async getTipsFeed(
    @Query() query: PaginationDto,
    @Query() filter: FeedFilterDto,
    @CurrentUser() currentUser: UserFromJwt,
  ): Promise<TipEntity[]> {
    const tips = await this.tipsService.getTipsFeed(
      query.page,
      query.count,
      filter,
      currentUser,
    );

    return tips.map((tip) => new TipEntity(tip));
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
    const users = await this.tipsService.likedBy(id, currentUser);

    return users.map((user) => new UserClientDto(user));
  }

  @Get('/user/:username')
  @IsPublic()
  @ApiResponse({ type: TipEntity, isArray: true })
  @ApiBearerAuth()
  @UseInterceptors(ClassSerializerInterceptor)
  async getByUser(
    @Query() query: PaginationDto,
    @Param('username') username: string,
    @CurrentUser() currentUser: UserFromJwt,
  ): Promise<TipEntity[]> {
    const posts = await this.tipsService.findByUsername(
      username,
      query.page,
      query.count,
      currentUser,
    );

    return posts.map((post) => {
      return new TipEntity(post);
    });
  }

  @Get(':id')
  @IsPublic()
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiResponse({ type: TipEntity, isArray: false })
  @ApiBearerAuth()
  @IsPublic()
  async findOne(
    @Param('id') id: string,
    @CurrentUser() currentUser: UserFromJwt,
  ): Promise<TipEntity> {
    const tip = await this.tipsService.findUnique(+id, currentUser);

    return new TipEntity(tip);
  }

  @Delete(':id')
  @ApiBearerAuth()
  remove(
    @Param('id') id: number,
    @CurrentUser() currentUser: UserFromJwt,
  ): Promise<void> {
    return this.tipsService.delete(+id, currentUser);
  }
}
