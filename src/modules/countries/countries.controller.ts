import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { CountriesService } from './countries.service';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { IsPublic } from 'src/modules/auth/decorators/is-public.decorator';
import { CountryRankingDto } from 'src/modules/countries/entities/country-ranking.dto';
import { CountryEntity } from 'src/modules/countries/entities/country.entity';
import { CountrySearchDto } from 'src/modules/countries/entities/country-search.dto';

@Controller('countries')
@ApiTags('countries')
export class CountriesController {
  constructor(private readonly countriesService: CountriesService) {}

  @Get()
  findAll() {
    return this.countriesService.findAll();
  }

  @Get('search')
  @IsPublic()
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiResponse({ type: CountryEntity, isArray: true })
  async search(@Query() query: CountrySearchDto): Promise<CountryEntity[]> {
    const countries = await this.countriesService.search(query);

    return countries.map((country) => new CountryEntity(country));
  }

  @Get('ranking/interest')
  @IsPublic()
  interestRanking(@Query() query: CountryRankingDto) {
    return this.countriesService.mostInterestedRanking(query.page, query.count);
  }

  @Get('ranking/visit')
  @IsPublic()
  visitRanking(@Query() query: CountryRankingDto) {
    return this.countriesService.mostVisitedRanking(query.page, query.count);
  }

  @Get(':iso2')
  @IsPublic()
  @ApiResponse({ type: CountryEntity })
  findByIso2(@Param('iso2') iso2: string): Promise<CountryEntity> {
    return this.countriesService.findByIso2(iso2);
  }
}
