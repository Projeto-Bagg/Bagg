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
import { CurrentUser } from 'src/modules/auth/decorators/current-user.decorator';
import { UserFromJwt } from 'src/modules/auth/models/UserFromJwt';
import { IsPublic } from 'src/modules/auth/decorators/is-public.decorator';
import { FilesInterceptor } from '@nestjs/platform-express';
import { UserClientDto } from 'src/modules/users/dtos/user-client.dto';
import { FeedFilterDto } from '../tip-words/dtos/feed-filter.dto';
import { PaginationDto } from 'src/commons/entities/pagination';
import { RelevantTipsDto } from '../tip-words/dtos/relevant-tips-dto';
import { SearchTipsDto } from './dtos/search-tips.dto';
import { TipClientDto } from 'src/modules/tips/dtos/tip-client.dto';

@Controller('tips')
@ApiTags('tips')
export class TipsController {
  constructor(private readonly tipsService: TipsService) {}

  @Get('search')
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiBearerAuth()
  @IsPublic()
  @ApiResponse({ type: TipClientDto, isArray: true })
  async searchTips(
    @CurrentUser() currentUser: UserFromJwt,
    @Query() query: SearchTipsDto,
  ): Promise<TipClientDto[]> {
    const tips = await this.tipsService.searchTips(
      currentUser,
      query.q,
      query.tags,
      query.city,
      query.page,
      query.count,
    );

    return tips.map((tip) => new TipClientDto(tip));
  }

  @Post()
  @UseInterceptors(ClassSerializerInterceptor)
  @UseInterceptors(FilesInterceptor('medias'))
  @ApiConsumes('multipart/form-data')
  @ApiBearerAuth()
  @ApiResponse({ type: TipClientDto })
  async create(
    @Body() createTipDto: CreateTipDto,
    @CurrentUser() currentUser: UserFromJwt,
    @UploadedFiles() medias: Express.Multer.File[],
  ): Promise<TipClientDto> {
    const tip = await this.tipsService.create(
      createTipDto,
      medias,
      currentUser,
    );

    return new TipClientDto(tip);
  }

  @Get('feed')
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiBearerAuth()
  @IsPublic()
  @ApiResponse({ type: TipClientDto, isArray: true })
  async getTipsFeed(
    @Query() query: PaginationDto,
    @Query() filter: FeedFilterDto,
    @CurrentUser() currentUser: UserFromJwt,
  ): Promise<TipClientDto[]> {
    const tips = await this.tipsService.getTipsFeed(
      query.page,
      query.count,
      filter,
      currentUser,
    );

    return tips.map((tip) => new TipClientDto(tip));
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
    return await this.tipsService.likedBy(id, currentUser);
  }

  @Get('/user/:username')
  @IsPublic()
  @ApiResponse({ type: TipClientDto, isArray: true })
  @ApiBearerAuth()
  @UseInterceptors(ClassSerializerInterceptor)
  async getByUser(
    @Query() query: PaginationDto,
    @Param('username') username: string,
    @CurrentUser() currentUser: UserFromJwt,
  ): Promise<TipClientDto[]> {
    const posts = await this.tipsService.findByUsername(
      username,
      query.page,
      query.count,
      currentUser,
    );

    return posts.map((post) => {
      return new TipClientDto(post);
    });
  }

  @Get(':id')
  @IsPublic()
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiResponse({ type: TipClientDto, status: 200 })
  @ApiResponse({ status: 404, description: 'Tip not found' })
  @ApiBearerAuth()
  @IsPublic()
  async findOne(
    @Param('id') id: string,
    @CurrentUser() currentUser: UserFromJwt,
  ): Promise<TipClientDto> {
    const tip = await this.tipsService.findUnique(+id, currentUser);

    return new TipClientDto(tip);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'Tip deleted successfully' })
  @ApiResponse({ status: 401, description: 'Tip not created by you' })
  @ApiResponse({ status: 404, description: 'Tip does not exist' })
  remove(
    @Param('id') id: number,
    @CurrentUser() currentUser: UserFromJwt,
  ): Promise<void> {
    return this.tipsService.delete(+id, currentUser);
  }

  @Get('recommend/tips-from-nearby-cities')
  @ApiResponse({ type: TipClientDto, isArray: true })
  @ApiBearerAuth()
  async getTipsFromRecommendedCities(
    @Query() query: PaginationDto,
    @CurrentUser() currentUser: UserFromJwt,
  ): Promise<TipClientDto[]> {
    const tips = await this.tipsService.getTipsFromRecommendedCities(
      currentUser,
      query.page,
      query.count,
    );
    return tips.map((tip) => new TipClientDto(tip));
  }

  @Get('recommend/tips-from-relevant-words')
  @ApiResponse({ type: TipClientDto, isArray: true })
  @ApiBearerAuth()
  async getRelevantTips(
    @Query() query: PaginationDto,
    @CurrentUser() currentUser: UserFromJwt,
    @Query() relevantTipsQuery: RelevantTipsDto,
  ): Promise<TipClientDto[]> {
    const tips = await this.tipsService.getRelevantTips(
      currentUser,
      relevantTipsQuery.wordCount,
      relevantTipsQuery.startDate,
      relevantTipsQuery.endDate,
      relevantTipsQuery.tipStartDate,
      query.page,
      query.count,
    );
    return tips.map((tip) => new TipClientDto(tip));
  }

  @Get('recommend/feed')
  @ApiResponse({ type: TipClientDto, isArray: true })
  @ApiBearerAuth()
  async getRecommendationFeed(
    @Query() query: PaginationDto,
    @CurrentUser() currentUser: UserFromJwt,
    @Query() relevantTipsQuery: RelevantTipsDto,
  ): Promise<TipClientDto[]> {
    const tips = await this.tipsService.getRecommendationFeed(
      currentUser,
      relevantTipsQuery.wordCount,
      relevantTipsQuery.startDate,
      relevantTipsQuery.endDate,
      relevantTipsQuery.tipStartDate,
      query.page,
      query.count,
    );
    return tips.map((tip) => new TipClientDto(tip));
  }

  @Post('report/:id')
  @ApiResponse({ status: 200, description: 'Reported successfully' })
  @ApiBearerAuth()
  report(
    @Param('id') id: number,
    @Body() createTipReport: CreateTipReportDto,
    @CurrentUser() currentUser: UserFromJwt,
  ) {
    return this.tipsService.report(id, createTipReport, currentUser);
  }
}
