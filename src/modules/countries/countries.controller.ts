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
import { CountryInterestRankingDto } from 'src/modules/countries/dtos/country-interest-ranking.dto';
import { CountryVisitRankingDto } from 'src/modules/countries/dtos/country-visit-ranking.dto';
import { CountryRatingRankingDto } from 'src/modules/countries/dtos/country-rating-ranking.dto';
import { CountryImageDto } from 'src/modules/countries/dtos/country-image.dto';
import { CountryImagesPaginationDto } from 'src/modules/countries/dtos/country-images-pagination.dto';

@Controller('countries')
@ApiTags('countries')
export class CountriesController {
  constructor(private readonly countriesService: CountriesService) {}

  @Get('search')
  @IsPublic()
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiResponse({ type: CountryEntity, isArray: true })
  async search(@Query() query: CountrySearchDto): Promise<CountryEntity[]> {
    return await this.countriesService.search(query);
  }

  @Get('ranking/interest')
  @ApiResponse({ type: CountryInterestRankingDto, isArray: true })
  @IsPublic()
  interestRanking(
    @Query() query: CountryRankingDto,
  ): Promise<CountryInterestRankingDto[]> {
    return this.countriesService.interestRanking(query.page, query.count);
  }

  @Get('ranking/visit')
  @ApiResponse({ type: CountryVisitRankingDto, isArray: true })
  @IsPublic()
  visitRanking(
    @Query() query: CountryRankingDto,
  ): Promise<CountryVisitRankingDto[]> {
    return this.countriesService.visitRanking(query.page, query.count);
  }

  @Get('ranking/rating')
  @ApiResponse({ type: CountryRatingRankingDto, isArray: true })
  @IsPublic()
  ratingRanking(
    @Query() query: CountryRankingDto,
  ): Promise<CountryRatingRankingDto[]> {
    return this.countriesService.ratingRanking(query.page, query.count);
  }

  @Get(':iso2')
  @IsPublic()
  @ApiResponse({ type: CountryEntity })
  findByIso2(@Param('iso2') iso2: string): Promise<CountryEntity> {
    return this.countriesService.findByIso2(iso2);
  }

  @Get(':iso2/images')
  @IsPublic()
  @ApiResponse({ type: CountryImageDto, isArray: true })
  images(
    @Param('iso2') iso2: string,
    @Query() query: CountryImagesPaginationDto,
  ): Promise<CountryImageDto[]> {
    return this.countriesService.getCountryImages(
      iso2,
      query.page,
      query.count,
    );
  }
}
