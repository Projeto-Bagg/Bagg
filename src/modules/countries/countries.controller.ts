import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { CountriesService } from './countries.service';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { IsPublic } from 'src/modules/auth/decorators/is-public.decorator';
import { CountryRankingDto } from 'src/modules/countries/dtos/country-ranking.dto';
import { CountryEntity } from 'src/modules/countries/entities/country.entity';
import { CountrySearchDto } from 'src/modules/countries/dtos/country-search.dto';
import { CountryVisitRankingDto } from 'src/modules/countries/dtos/country-visit-ranking.dto';
import { CountryRatingRankingDto } from 'src/modules/countries/dtos/country-rating-ranking.dto';
import { CountryImageDto } from 'src/modules/countries/dtos/country-image.dto';
import { CountryImagesPaginationDto } from 'src/modules/countries/dtos/country-images-pagination.dto';
import { UserEntity } from 'src/modules/users/entities/user.entity';
import { PaginationDto } from 'src/commons/entities/pagination';
import { UsersService } from 'src/modules/users/users.service';
import { CurrentUser } from 'src/modules/auth/decorators/current-user.decorator';
import { UserFromJwt } from 'src/modules/auth/models/UserFromJwt';

@Controller('countries')
@ApiTags('countries')
export class CountriesController {
  constructor(
    private readonly countriesService: CountriesService,
    private readonly usersService: UsersService,
  ) {}

  @Get()
  @IsPublic()
  @ApiResponse({ type: CountryEntity, isArray: true })
  async findMany(): Promise<CountryEntity[]> {
    return await this.countriesService.findMany();
  }

  @Get('search')
  @IsPublic()
  @ApiResponse({ type: CountryEntity, isArray: true })
  async search(@Query() query: CountrySearchDto): Promise<CountryEntity[]> {
    return await this.countriesService.search(query);
  }

  @Get('ranking/visit')
  @ApiResponse({ type: CountryVisitRankingDto, isArray: true })
  @IsPublic()
  visitRanking(
    @Query() countryRankingDto: CountryRankingDto,
  ): Promise<CountryVisitRankingDto[]> {
    return this.countriesService.visitRanking(countryRankingDto);
  }

  @Get('ranking/rating')
  @ApiResponse({ type: CountryRatingRankingDto, isArray: true })
  @IsPublic()
  ratingRanking(
    @Query() countryRankingDto: CountryRankingDto,
  ): Promise<CountryRatingRankingDto[]> {
    return this.countriesService.ratingRanking(countryRankingDto);
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

  @Get(':iso2/residents')
  @UseInterceptors(ClassSerializerInterceptor)
  @IsPublic()
  @ApiBearerAuth()
  @ApiResponse({ type: UserEntity, isArray: true })
  async residents(
    @Param('iso2') iso2: string,
    @Query() query: PaginationDto,
    @CurrentUser() currentUser: UserFromJwt,
  ): Promise<UserEntity[]> {
    const users = await this.usersService.findByCountry(
      {
        countryIso2: iso2,
        page: query.page,
        count: query.count,
      },
      currentUser,
    );

    return users.map((user) => new UserEntity(user));
  }
}
