import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TripDiariesService } from './trip-diaries.service';
import { CreateTripDiaryDto } from './dto/create-trip-diary.dto';
import { UpdateTripDiaryDto } from './dto/update-trip-diary.dto';

@Controller('trip-diaries')
export class TripDiariesController {
  constructor(private readonly tripDiariesService: TripDiariesService) {}

  @Post()
  create(@Body() createTripDiaryDto: CreateTripDiaryDto) {
    return this.tripDiariesService.create(createTripDiaryDto);
  }

  @Get()
  findAll() {
    return this.tripDiariesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tripDiariesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTripDiaryDto: UpdateTripDiaryDto) {
    return this.tripDiariesService.update(+id, updateTripDiaryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tripDiariesService.remove(+id);
  }
}
