import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CityInterestsService } from './city-interests.service';
import { CreateCityInterestDto } from './dto/create-city-interest.dto';
import { UpdateCityInterestDto } from './dto/update-city-interest.dto';
import { ApiTags } from '@nestjs/swagger';

@Controller('city-interests')
@ApiTags('city interests')
export class CityInterestsController {
  constructor(private readonly cityInterestsService: CityInterestsService) {}

  @Post()
  create(@Body() createCityInterestDto: CreateCityInterestDto) {
    return this.cityInterestsService.create(createCityInterestDto);
  }

  @Get()
  findAll() {
    return this.cityInterestsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.cityInterestsService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCityInterestDto: UpdateCityInterestDto,
  ) {
    return this.cityInterestsService.update(+id, updateCityInterestDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.cityInterestsService.remove(+id);
  }
}
