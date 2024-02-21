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
import { CountryRankingDto } from 'src/modules/countries/dtos/country-ranking.dto';
import { CountryEntity } from 'src/modules/countries/entities/country.entity';
import { CountrySearchDto } from 'src/modules/countries/dtos/country-search.dto';
import { CountryVisitRankingEntity } from 'src/modules/countries/entities/country-visit-ranking.entity';
import { CountryInterestRankingEntity } from 'src/modules/countries/entities/country-interest-ranking.entity';
import { CountryRatingRankingEntity } from 'src/modules/countries/entities/country-rating-ranking.entity';

@Controller('countries')
@ApiTags('countries')
export class CountriesController {
  constructor(private readonly countriesService: CountriesService) {}

  @Get('search')
  @IsPublic()
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiResponse({ type: CountryEntity, isArray: true })
  async search(@Query() query: CountrySearchDto): Promise<CountryEntity[]> {
    const countries = await this.countriesService.search(query);

    return countries.map((country) => new CountryEntity(country));
  }

  @Get('ranking/interest')
  @ApiResponse({ type: CountryInterestRankingEntity, isArray: true })
  @IsPublic()
  interestRanking(
    @Query() query: CountryRankingDto,
  ): Promise<CountryInterestRankingEntity[]> {
    return this.countriesService.interestRanking(query.page, query.count);
  }

  @Get('ranking/visit')
  @ApiResponse({ type: CountryVisitRankingEntity, isArray: true })
  @IsPublic()
  visitRanking(
    @Query() query: CountryRankingDto,
  ): Promise<CountryVisitRankingEntity[]> {
    return this.countriesService.visitRanking(query.page, query.count);
  }

  @Get('ranking/rating')
  @ApiResponse({ type: CountryVisitRankingEntity, isArray: true })
  @IsPublic()
  ratingRanking(
    @Query() query: CountryRankingDto,
  ): Promise<CountryRatingRankingEntity[]> {
    return this.countriesService.ratingRanking(query.page, query.count);
  }

  @Get(':iso2')
  @IsPublic()
  @ApiResponse({ type: CountryEntity })
  findByIso2(@Param('iso2') iso2: string): Promise<CountryEntity> {
    return this.countriesService.findByIso2(iso2);
  }
}
