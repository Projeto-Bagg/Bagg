import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ApiTags, ApiResponse } from '@nestjs/swagger';
import { IsPublic } from '../auth/decorators/is-public.decorator';
import { DistanceService } from './distance.service';
import { CityByDistanceDto } from './dtos/city-by-distance.dto';
import { RegionByDistanceDto } from './dtos/region-by-distance.dto';
import { CountryByDistanceDto } from './dtos/country-by-distance.dto';
import { PaginationDto } from 'src/commons/entities/pagination';
import { DistanceBodyDto } from './dtos/distance-body.dto';

@Controller('distance')
@ApiTags('distance')
export class DistanceController {
  constructor(private readonly distanceService: DistanceService) {}

  @Post('closest-cities')
  @IsPublic()
  @ApiResponse({ type: CityByDistanceDto, isArray: true })
  async getClosestCities(
    @Body() body: DistanceBodyDto,
    @Query() query: PaginationDto,
  ) {
    return await this.distanceService.getClosestCitiesWithRegions(
      body.ids,
      query.page,
      query.count,
    );
  }

  @Post('closest-regions')
  @IsPublic()
  @ApiResponse({ type: RegionByDistanceDto, isArray: true })
  async getClosestRegions(
    @Body() body: DistanceBodyDto,
    @Query() query: PaginationDto,
  ) {
    return await this.distanceService.getClosestRegions(
      body.ids,
      query.page,
      query.count,
    );
  }

  @Post('closest-countries')
  @IsPublic()
  @ApiResponse({ type: CountryByDistanceDto, isArray: true })
  async getClosestCountries(
    @Body() body: DistanceBodyDto,
    @Query() query: PaginationDto,
  ) {
    return await this.distanceService.getClosestCountries(
      body.ids,
      query.page,
      query.count,
    );
  }
}
