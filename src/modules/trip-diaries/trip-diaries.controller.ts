import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { TripDiariesService } from './trip-diaries.service';
import { CreateTripDiaryDto } from './dtos/create-trip-diary.dto';
import { UpdateTripDiaryDto } from './dtos/update-trip-diary.dto';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { IsPublic } from 'src/modules/auth/decorators/is-public.decorator';
import { CurrentUser } from 'src/modules/auth/decorators/current-user.decorator';
import { UserFromJwt } from 'src/modules/auth/models/UserFromJwt';
import { TripDiaryEntity } from 'src/modules/trip-diaries/entities/trip-diary.entity';
import { DiaryPostEntity } from 'src/modules/diary-posts/entities/diary-post.entity';
import { TripDiaryClientEntity } from 'src/modules/trip-diaries/entities/trip-diary-client.entity';

@Controller('tripDiaries')
@ApiTags('trip diaries')
export class TripDiariesController {
  constructor(private readonly tripDiariesService: TripDiariesService) {}

  @Post()
  @ApiBearerAuth()
  @ApiResponse({ type: TripDiaryEntity })
  create(
    @Body() createTripDiaryDto: CreateTripDiaryDto,
    @CurrentUser() currentUser: UserFromJwt,
  ) {
    return this.tripDiariesService.create(createTripDiaryDto, currentUser);
  }

  @Get('user/:username')
  @ApiResponse({ type: TripDiaryClientEntity, isArray: true })
  @IsPublic()
  findByUsername(
    @Param('username') username: string,
  ): Promise<TripDiaryClientEntity[]> {
    return this.tripDiariesService.findByUsername(username);
  }

  @Get(':id/posts')
  @IsPublic()
  @ApiBearerAuth()
  @ApiResponse({ type: DiaryPostEntity, isArray: true })
  findPostsById(
    @Param('id') id: number,
    @CurrentUser() currentUser: UserFromJwt,
  ): Promise<DiaryPostEntity[]> {
    return this.tripDiariesService.findPostsById(id, currentUser);
  }

  @Get(':id')
  @IsPublic()
  @ApiResponse({ type: TripDiaryEntity })
  findOne(@Param('id') id: number): Promise<TripDiaryEntity> {
    return this.tripDiariesService.findOne(id);
  }

  @Patch(':id')
  @ApiResponse({ type: TripDiaryEntity })
  update(
    @Param('id') id: string,
    @Body() updateTripDiaryDto: UpdateTripDiaryDto,
  ): Promise<TripDiaryEntity> {
    return this.tripDiariesService.update(+id, updateTripDiaryDto);
  }

  @Delete(':id')
  @ApiResponse({ type: TripDiaryEntity })
  remove(@Param('id') id: string): Promise<TripDiaryEntity> {
    return this.tripDiariesService.remove(+id);
  }
}
