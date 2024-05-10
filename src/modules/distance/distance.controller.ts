import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags, ApiResponse } from '@nestjs/swagger';
import { IsPublic } from '../auth/decorators/is-public.decorator';
import { DistanceService } from './distance.service';
import { CityByDistanceDto } from './dtos/city-by-distance.dto';
import { RegionByDistanceDto } from './dtos/region-by-distance.dto';
import { CountryByDistanceDto } from './dtos/country-by-distance.dto';
import { PaginationDto } from 'src/commons/entities/pagination';

@Controller('distance')
@ApiTags('distance')
export class DistanceController {
  constructor(private readonly distanceService: DistanceService) {}

  @Get('closest-cities/:id')
  @IsPublic()
  @ApiResponse({ type: CityByDistanceDto, isArray: true })
  async getClosestCities(
    @Param('id') id: number,
    @Query() query: PaginationDto,
  ): Promise<CityByDistanceDto[]> {
    return (await this.distanceService.getClosestCities(
      +id,
      query.page,
      query.count,
    )) as CityByDistanceDto[];
  }

  @Get('closest-cities-test/:id')
  @IsPublic()
  @ApiResponse({ type: CityByDistanceDto, isArray: true })
  async getClosestCitiesTest(
    @Param('id') id: number,
    @Query() query: PaginationDto,
  ): Promise<CityByDistanceDto[]> {
    return (await this.distanceService.getClosestCitiesTest(
      +id,
      query.page,
      query.count,
    )) as CityByDistanceDto[];
  }

  @Get('closest-regions/:id')
  @IsPublic()
  @ApiResponse({ type: RegionByDistanceDto, isArray: true })
  async getClosestRegions(
    @Param('id') id: number,
    @Query() query: PaginationDto,
  ): Promise<RegionByDistanceDto[]> {
    return (await this.distanceService.getClosestRegions(
      +id,
      query.page,
      query.count,
    )) as RegionByDistanceDto[];
  }

  @Get('closest-countries/:id')
  @IsPublic()
  @ApiResponse({ type: CountryByDistanceDto, isArray: true })
  async getClosestCountries(
    @Param('id') id: number,
    @Query() query: PaginationDto,
  ): Promise<CountryByDistanceDto[]> {
    return (await this.distanceService.getClosestCountries(
      +id,
      query.page,
      query.count,
    )) as CountryByDistanceDto[];
  }
}
