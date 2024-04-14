import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags, ApiResponse } from '@nestjs/swagger';
import { IsPublic } from '../auth/decorators/is-public.decorator';
import { DistanceService } from './distance.service';
import { CityByDistanceDto } from './dtos/city-by-distance.dto';
import { RegionByDistanceDto } from './dtos/region-by-distance.dto';
import { CountryByDistanceDto } from './dtos/country-by-distance.dto';

@Controller('distance')
@ApiTags('distance')
export class DistanceController {
  constructor(private readonly distanceService: DistanceService) {}

  @Get('closest-cities/:id')
  @IsPublic()
  @ApiResponse({ type: CityByDistanceDto, isArray: true })
  async getClosestCities(
    @Param('id') id: number,
  ): Promise<CityByDistanceDto[]> {
    return (await this.distanceService.getClosestCities(
      +id,
    )) as CityByDistanceDto[];
  }

  @Get('closest-regions/:id')
  @IsPublic()
  @ApiResponse({ type: RegionByDistanceDto, isArray: true })
  async getClosestRegions(
    @Param('id') id: number,
  ): Promise<RegionByDistanceDto[]> {
    return (await this.distanceService.getClosestRegions(
      +id,
    )) as RegionByDistanceDto[];
  }

  @Get('closest-countries/:id')
  @IsPublic()
  @ApiResponse({ type: CountryByDistanceDto, isArray: true })
  async getClosestCountries(
    @Param('id') id: number,
  ): Promise<CountryByDistanceDto[]> {
    return (await this.distanceService.getClosestCountries(
      +id,
    )) as CountryByDistanceDto[];
  }
}
