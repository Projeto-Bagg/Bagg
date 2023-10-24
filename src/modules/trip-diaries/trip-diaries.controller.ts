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
import { CreateTripDiaryDto } from './dto/create-trip-diary.dto';
import { UpdateTripDiaryDto } from './dto/update-trip-diary.dto';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { IsPublic } from 'src/modules/auth/decorators/is-public.decorator';
import { CurrentUser } from 'src/modules/auth/decorators/current-user.decorator';
import { UserFromJwt } from 'src/modules/auth/models/UserFromJwt';
import { TripDiaryEntity } from 'src/modules/trip-diaries/entities/trip-diary.entity';

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
  @IsPublic()
  findByUsername(@Param('username') username: string) {
    return this.tripDiariesService.findByUsername(username);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tripDiariesService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateTripDiaryDto: UpdateTripDiaryDto,
  ) {
    return this.tripDiariesService.update(+id, updateTripDiaryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tripDiariesService.remove(+id);
  }
}
