import {
  Controller,
  Post,
  Body,
  Param,
  Delete,
  Put,
  Query,
  Get,
} from '@nestjs/common';
import { CityVisitsService } from './city-visits.service';
import { CreateCityVisitDto } from './dtos/create-city-visit.dto';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UserFromJwt } from '../auth/models/UserFromJwt';
import { DeleteCityVisitDto } from './dtos/delete-city-visit.dto';
import { CityVisitEntity } from './entities/city-visit.entity';
import { UpdateCityVisitDto } from './dtos/update-city-visit.dto';
import { CityVisitClientDto } from './dtos/city-visit-client.dto';
import { IsPublic } from '../auth/decorators/is-public.decorator';
import { CountryCityVisitDto } from './dtos/country-city-visit.dto';
import { PaginationDto } from 'src/commons/entities/pagination';
@Controller('city-visits')
@ApiTags('city visits')
export class CityVisitsController {
  constructor(private readonly cityVisitService: CityVisitsService) {}

  @Post()
  @ApiResponse({ type: CityVisitClientDto })
  @ApiBearerAuth()
  create(
    @Body() createCityVisitDto: CreateCityVisitDto,
    @CurrentUser() currentUser: UserFromJwt,
  ): Promise<CityVisitClientDto> {
    return this.cityVisitService.create(createCityVisitDto, currentUser);
  }

  @Put()
  @ApiResponse({ type: CityVisitEntity })
  @ApiBearerAuth()
  update(
    @Body() updateCityVisitDto: UpdateCityVisitDto,
    @CurrentUser() currentUser: UserFromJwt,
  ): Promise<CityVisitEntity> {
    return this.cityVisitService.update(updateCityVisitDto, currentUser);
  }

  @Get(':cityId')
  @ApiResponse({ type: CityVisitClientDto, isArray: true })
  @IsPublic()
  async get(
    @Param('cityId') cityId: number,
    @Query() query: PaginationDto,
  ): Promise<CityVisitClientDto[]> {
    return await this.cityVisitService.getVisitsByCityId(
      +cityId,
      query.page,
      query.count,
    );
  }

  @Get('/country/:countryIso2')
  @ApiResponse({ type: CountryCityVisitDto, isArray: true })
  @IsPublic()
  async getByCountry(
    @Param('countryIso2') countryIso2: string,
    @Query() query: PaginationDto,
  ): Promise<CountryCityVisitDto[]> {
    const visits = await this.cityVisitService.getVisitsByCountryIso2(
      countryIso2,
      query.page,
      query.count,
    );

    return visits.map((visit) => new CountryCityVisitDto(visit));
  }

  @Delete(':cityId')
  @ApiResponse({ type: CityVisitEntity })
  @ApiBearerAuth()
  remove(
    @Param() param: DeleteCityVisitDto,
    @CurrentUser() currentUser: UserFromJwt,
  ): Promise<void> {
    return this.cityVisitService.remove(param.cityId, currentUser);
  }
}
