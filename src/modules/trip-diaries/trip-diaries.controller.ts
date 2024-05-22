import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { TripDiariesService } from './trip-diaries.service';
import { CreateTripDiaryDto } from './dtos/create-trip-diary.dto';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { IsPublic } from 'src/modules/auth/decorators/is-public.decorator';
import { CurrentUser } from 'src/modules/auth/decorators/current-user.decorator';
import { UserFromJwt } from 'src/modules/auth/models/UserFromJwt';
import { TripDiaryEntity } from 'src/modules/trip-diaries/entities/trip-diary.entity';
import { DiaryPostEntity } from 'src/modules/diary-posts/entities/diary-post.entity';
import { TripDiaryClientDto } from 'src/modules/trip-diaries/dtos/trip-diary-client.dto';
import { DiaryPostClientDto } from 'src/modules/diary-posts/dtos/diary-post-client.dto';
import { PaginationDto } from 'src/commons/entities/pagination';

@Controller('trip-diaries')
@ApiTags('trip diaries')
export class TripDiariesController {
  constructor(private readonly tripDiariesService: TripDiariesService) {}

  @Post()
  @ApiBearerAuth()
  @ApiResponse({ type: TripDiaryClientDto })
  create(
    @Body() createTripDiaryDto: CreateTripDiaryDto,
    @CurrentUser() currentUser: UserFromJwt,
  ): Promise<TripDiaryClientDto> {
    return this.tripDiariesService.create(createTripDiaryDto, currentUser);
  }

  @Get('user/:username')
  @ApiResponse({ type: TripDiaryClientDto, isArray: true })
  @UseInterceptors(ClassSerializerInterceptor)
  @IsPublic()
  async findByUsername(
    @Param('username') username: string,
  ): Promise<TripDiaryClientDto[]> {
    return await this.tripDiariesService.findByUsername(username);
  }

  @Get(':id/posts')
  @IsPublic()
  @ApiBearerAuth()
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiResponse({ type: DiaryPostEntity, isArray: true })
  async findPostsById(
    @Param('id') id: number,
    @Query() query: PaginationDto,
    @CurrentUser() currentUser: UserFromJwt,
  ): Promise<DiaryPostClientDto[]> {
    const posts = await this.tripDiariesService.findPostsById(
      id,
      currentUser,
      query.page,
      query.count,
    );

    return posts.map((post) => new DiaryPostClientDto(post));
  }

  @Get(':id')
  @IsPublic()
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiResponse({ type: TripDiaryClientDto, status: 200 })
  @ApiResponse({ status: 404, description: 'Trip diary does not exist' })
  async findOne(@Param('id') id: number): Promise<TripDiaryClientDto> {
    return await this.tripDiariesService.findOne(id);
  }

  @Delete(':id')
  @ApiResponse({ type: TripDiaryEntity })
  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'Trip diary deleted successfully' })
  @ApiResponse({ status: 401, description: 'Trip diary not created by you' })
  @ApiResponse({ status: 404, description: 'Trip diary does not exist' })
  remove(
    @Param('id') id: number,
    @CurrentUser() currentUser: UserFromJwt,
  ): Promise<void> {
    return this.tripDiariesService.remove(+id, currentUser);
  }
}
