import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { CitiesService } from './cities.service';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { IsPublic } from 'src/modules/auth/decorators/is-public.decorator';
import { CurrentUser } from 'src/modules/auth/decorators/current-user.decorator';
import { UserFromJwt } from 'src/modules/auth/models/UserFromJwt';
import { CityRankingDto } from 'src/modules/cities/dtos/city-ranking.dto';
import { CityInterestRankingDto } from 'src/modules/cities/dtos/city-interest-ranking.dto';
import { CitySearchDto } from 'src/modules/cities/dtos/city-search.dto';
import { CityVisitRankingDto } from 'src/modules/cities/dtos/city-visit-ranking.dto';
import { FindCityByIdDto } from 'src/modules/cities/dtos/find-city-by-id.dto';
import { CityRatingRankingDto } from 'src/modules/cities/dtos/city-rating-ranking.dto';
import { CityVisitsService } from 'src/modules/city-visits/city-visits.service';
import { CityPageDto } from 'src/modules/cities/dtos/city-page.dto';
import { CityInterestsService } from 'src/modules/city-interests/city-interests.service';
import { CitySearchResponseDto } from 'src/modules/cities/dtos/city-search-response';

@Controller('cities')
@ApiTags('cities')
export class CitiesController {
  constructor(
    private readonly citiesService: CitiesService,
    private readonly cityVisitsService: CityVisitsService,
    private readonly cityInterestsService: CityInterestsService,
  ) {}

  @Get('search')
  @IsPublic()
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiResponse({ type: CitySearchResponseDto, isArray: true })
  async search(
    @Query() query: CitySearchDto,
  ): Promise<CitySearchResponseDto[]> {
    return await this.citiesService.search(query);
  }

  @Get(':id')
  @IsPublic()
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiResponse({ type: CityPageDto })
  async findById(
    @Param() param: FindCityByIdDto,
    @CurrentUser() currentUser: UserFromJwt,
  ): Promise<CityPageDto> {
    const city = await this.citiesService.findById(+param.id, currentUser);

    return new CityPageDto(city);
  }

  @Get('ranking/interest')
  @IsPublic()
  @ApiResponse({ type: CityInterestRankingDto, isArray: true })
  interestRanking(
    @Query() query: CityRankingDto,
  ): Promise<CityInterestRankingDto[]> {
    return this.citiesService.interestRanking(query.page, query.count);
  }

  @Get('ranking/visit')
  @IsPublic()
  @ApiResponse({ type: CityVisitRankingDto, isArray: true })
  visitRanking(@Query() query: CityRankingDto): Promise<CityVisitRankingDto[]> {
    return this.citiesService.visitRanking(query.page, query.count);
  }

  @Get('ranking/rating')
  @IsPublic()
  @ApiResponse({ type: CityRatingRankingDto, isArray: true })
  ratingRanking(
    @Query() query: CityRankingDto,
  ): Promise<CityRatingRankingDto[]> {
    return this.citiesService.ratingRanking(query.page, query.count);
  }
}
