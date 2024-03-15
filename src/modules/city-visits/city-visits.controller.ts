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
import { CurrentUser } from 'src/modules/auth/decorators/current-user.decorator';
import { UserFromJwt } from 'src/modules/auth/models/UserFromJwt';
import { DeleteCityVisitDto } from 'src/modules/city-visits/dtos/delete-city-visit.dto';
import { CityVisitEntity } from 'src/modules/city-visits/entities/city-visit.entity';
import { UpdateCityVisitDto } from 'src/modules/city-visits/dtos/update-city-visit.dto';
import { MediaEntity } from 'src/modules/media/entities/media.entity';
import { CityVisitPaginationDto } from 'src/modules/city-visits/dtos/city-visit-pagination.dto';
import { CityVisitClientDto } from 'src/modules/city-visits/dtos/city-visit-client.dto';
import { IsPublic } from 'src/modules/auth/decorators/is-public.decorator';

@Controller('city-visits')
@ApiTags('city visits')
export class CityVisitsController {
  constructor(private readonly cityVisitService: CityVisitsService) {}

  @Post()
  @ApiResponse({ type: CityVisitEntity })
  @ApiBearerAuth()
  create(
    @Body() createCityVisitDto: CreateCityVisitDto,
    @CurrentUser() currentUser: UserFromJwt,
  ): Promise<CityVisitEntity> {
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
  get(
    @Param('cityId') cityId: number,
    @Query() query: CityVisitPaginationDto,
  ): Promise<CityVisitClientDto[]> {
    return this.cityVisitService.getVisitsByCityId(
      +cityId,
      query.page,
      query.count,
    );
  }

  @Delete(':cityId')
  @ApiResponse({ type: CityVisitEntity })
  @ApiBearerAuth()
  remove(
    @Param() param: DeleteCityVisitDto,
    @CurrentUser() currentUser: UserFromJwt,
  ): Promise<boolean> {
    return this.cityVisitService.remove(param.cityId, currentUser);
  }
}
