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
import { CityInterestRankingEntity } from 'src/modules/cities/entities/city-interest-ranking.entity';
import { CityEntity } from 'src/modules/cities/entities/city.entity';
import { CityClientEntity } from 'src/modules/cities/entities/city-client.entity';
import { CitySearchDto } from 'src/modules/cities/dtos/city-search.dto';
import { CityVisitRankingEntity } from 'src/modules/cities/entities/city-visit-ranking.entity';
import { FindCityById } from 'src/modules/cities/dtos/find-city-by-id.dto';
import { CityRatingRankingEntity } from 'src/modules/cities/entities/city-rating-ranikng.entity';
import { CityNearDto } from 'src/modules/cities/dtos/city-near.dto';
import { CityVisitsService } from 'src/modules/city-visits/city-visits.service';
import { CityPageEntity } from 'src/modules/cities/entities/city-page.entity';

@Controller('cities')
@ApiTags('cities')
export class CitiesController {
  constructor(
    private readonly citiesService: CitiesService,
    private readonly cityVisitsService: CityVisitsService,
  ) {}

  @Get('search')
  @IsPublic()
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiResponse({ type: CityEntity, isArray: true })
  async search(@Query() query: CitySearchDto): Promise<CityEntity[]> {
    const city = await this.citiesService.search(query);

    return city.map((city) => new CityEntity(city));
  }

  @Get('/near')
  @IsPublic()
  near(@Query() query: CityNearDto) {
    return this.citiesService.getNearCities(
      query.cityId,
      query.page,
      query.count,
    );
  }

  @Get(':id')
  @IsPublic()
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiResponse({ type: CityPageEntity })
  async findById(
    @Param() param: FindCityById,
    @CurrentUser() currentUser: UserFromJwt,
  ): Promise<CityClientEntity> {
    const city = await this.citiesService.findById(+param.id, currentUser);

    const visits = await this.cityVisitsService.getVisitsByCityId(
      city.id,
      1,
      5,
    );

    return new CityPageEntity({
      ...city,
      visits,
    });
  }

  @Get('ranking/interest')
  @IsPublic()
  @ApiResponse({ type: CityInterestRankingEntity, isArray: true })
  interestRanking(
    @Query() query: CityRankingDto,
  ): Promise<CityInterestRankingEntity[]> {
    return this.citiesService.interestRanking(query.page, query.count);
  }

  @Get('ranking/visit')
  @IsPublic()
  @ApiResponse({ type: CityVisitRankingEntity, isArray: true })
  visitRanking(
    @Query() query: CityRankingDto,
  ): Promise<CityVisitRankingEntity[]> {
    return this.citiesService.visitRanking(query.page, query.count);
  }

  @Get('ranking/rating')
  @IsPublic()
  @ApiResponse({ type: CityRatingRankingEntity, isArray: true })
  ratingRanking(
    @Query() query: CityRankingDto,
  ): Promise<CityRatingRankingEntity[]> {
    return this.citiesService.ratingRanking(query.page, query.count);
  }
}
