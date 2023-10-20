import { Controller, Get, Param } from '@nestjs/common';
import { CountriesService } from './countries.service';
import { ApiTags } from '@nestjs/swagger';

@Controller('countries')
@ApiTags('countries')
export class CountriesController {
  constructor(private readonly countriesService: CountriesService) {}

  @Get()
  findAll() {
    return this.countriesService.findAll();
  }

  @Get(':iso2')
  findByIso2(@Param('iso2') iso2: string) {
    return this.countriesService.findByIso2(iso2);
  }
}
