import { Controller, Get, Param, Query } from '@nestjs/common';
import { CountriesService } from './countries.service';
import { ApiTags } from '@nestjs/swagger';
import { IsPublic } from 'src/modules/auth/decorators/is-public.decorator';
import { CountryRankingDto } from 'src/modules/countries/entities/country-ranking.dto';

@Controller('countries')
@ApiTags('countries')
export class CountriesController {
  constructor(private readonly countriesService: CountriesService) {}

  @Get()
  findAll() {
    return this.countriesService.findAll();
  }

  @Get('ranking/interest')
  @IsPublic()
  ranking(@Query() query: CountryRankingDto) {
    return this.countriesService.mostInterestedRanking(query.page, query.count);
  }

  @Get(':iso2')
  @IsPublic()
  findByIso2(@Param('iso2') iso2: string) {
    return this.countriesService.findByIso2(iso2);
  }
}
