import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { CitiesService } from './cities.service';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
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
import { CityImageDto } from 'src/modules/cities/dtos/city-image.dto';
import { UsersService } from 'src/modules/users/users.service';
import { UserEntity } from 'src/modules/users/entities/user.entity';
import { PaginationDto } from 'src/commons/entities/pagination';

@Controller('cities')
@ApiTags('cities')
export class CitiesController {
  constructor(
    private readonly citiesService: CitiesService,
    private readonly usersService: UsersService,
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

  @Get('trending')
  @IsPublic()
  trending() {
    return this.citiesService.trending();
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
    @Query() query: PaginationDto,
  ): Promise<CityImageDto[]> {
    return this.citiesService.getCityImages(+id, query.page, query.count);
  }

  @Get(':id/residents')
  @UseInterceptors(ClassSerializerInterceptor)
  @IsPublic()
  @ApiBearerAuth()
  @ApiResponse({ type: UserEntity, isArray: true })
  async residents(
    @Param('id') id: number,
    @Query() query: PaginationDto,
    @CurrentUser() currentUser: UserFromJwt,
  ): Promise<UserEntity[]> {
    const users = await this.usersService.findByCity(
      {
        cityId: id,
        page: query.page,
        count: query.count,
      },
      currentUser,
    );

    return users.map((user) => new UserEntity(user));
  }

  @Get('ranking/interest')
  @IsPublic()
  @ApiResponse({ type: CityInterestRankingDto, isArray: true })
  interestRanking(
    @Query() cityRankingDto: CityRankingDto,
  ): Promise<CityInterestRankingDto[]> {
    return this.citiesService.interestRanking(cityRankingDto);
  }

  @Get('ranking/visit')
  @IsPublic()
  @ApiResponse({ type: CityVisitRankingDto, isArray: true })
  visitRanking(
    @Query() cityRankingDto: CityRankingDto,
  ): Promise<CityVisitRankingDto[]> {
    return this.citiesService.visitRanking(cityRankingDto);
  }

  @Get('ranking/rating')
  @IsPublic()
  @ApiResponse({ type: CityRatingRankingDto, isArray: true })
  ratingRanking(
    @Query() cityRankingDto: CityRankingDto,
  ): Promise<CityRatingRankingDto[]> {
    return this.citiesService.ratingRanking(cityRankingDto);
  }
}
