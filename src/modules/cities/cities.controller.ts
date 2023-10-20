import { Controller, Get, Param } from '@nestjs/common';
import { CitiesService } from './cities.service';
import { ApiTags } from '@nestjs/swagger';

@Controller('cities')
@ApiTags('cities')
export class CitiesController {
  constructor(private readonly citiesService: CitiesService) {}

  @Get()
  findAll() {
    return this.citiesService.findAll();
  }

  @Get(':countryIso2')
  findByCountry(@Param('countryIso2') countryIso2: string) {
    return this.citiesService.findByCountry(countryIso2);
  }
}
