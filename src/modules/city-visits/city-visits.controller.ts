import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CityVisitsService } from './city-visits.service';
import { CreateCityVisitDto } from './dto/create-city-visit.dto';
import { UpdateCityVisitDto } from './dto/update-city-visit.dto';
import { ApiTags } from '@nestjs/swagger';

@Controller('city-visits')
@ApiTags('city visits')
export class CityVisitsController {
  constructor(private readonly cityVisitsService: CityVisitsService) {}

  @Post()
  create(@Body() createCityVisitDto: CreateCityVisitDto) {
    return this.cityVisitsService.create(createCityVisitDto);
  }

  @Get()
  findAll() {
    return this.cityVisitsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.cityVisitsService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCityVisitDto: UpdateCityVisitDto,
  ) {
    return this.cityVisitsService.update(+id, updateCityVisitDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.cityVisitsService.remove(+id);
  }
}
