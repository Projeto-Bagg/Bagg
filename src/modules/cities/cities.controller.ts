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
import { CityRatingRankingDto } from 'src/modules/cities/dtos/city-rating-ranking.dto';
import { CityPageDto } from 'src/modules/cities/dtos/city-page.dto';
import { CitySearchResponseDto } from 'src/modules/cities/dtos/city-search-response';
import { MediaEntity } from 'src/modules/media/entities/media.entity';
import { CityImagesPaginationDto } from 'src/modules/cities/dtos/city-images-pagination.dto';
import { CityImageDto } from 'src/modules/cities/dtos/city-image.dto';

@Controller('cities')
@ApiTags('cities')
export class CitiesController {
  constructor(private readonly citiesService: CitiesService) {}

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
    @Param('id') id: number,
    @CurrentUser() currentUser: UserFromJwt,
  ): Promise<CityPageDto> {
    const city = await this.citiesService.findById(+id, currentUser);

    return new CityPageDto(city);
  }

  @Get(':id/images')
  @IsPublic()
  @ApiResponse({ type: CityImageDto, isArray: true })
  images(
    @Param('id') id: number,
    @Query() query: CityImagesPaginationDto,
  ): Promise<CityImageDto[]> {
    return this.citiesService.getCityImages(+id, query.page, query.count);
  }

  @Get('ranking/interest')
  @IsPublic()
  @ApiResponse({ type: CityInterestRankingDto, isArray: true })
  interestRanking(
    @Query() query: CityRankingDto,
  ): Promise<CityInterestRankingDto[]> {
    return this.citiesService.interestRanking(
      query.page,
      query.count,
      query.countryIso2,
    );
  }

  @Get('ranking/visit')
  @IsPublic()
  @ApiResponse({ type: CityVisitRankingDto, isArray: true })
  visitRanking(@Query() query: CityRankingDto): Promise<CityVisitRankingDto[]> {
    return this.citiesService.visitRanking(
      query.page,
      query.count,
      query.countryIso2,
    );
  }

  @Get('ranking/rating')
  @IsPublic()
  @ApiResponse({ type: CityRatingRankingDto, isArray: true })
  ratingRanking(
    @Query() query: CityRankingDto,
  ): Promise<CityRatingRankingDto[]> {
    return this.citiesService.ratingRanking(
      query.page,
      query.count,
      query.countryIso2,
    );
  }
}
