import { Controller, Post, Body, Param, Delete } from '@nestjs/common';
import { CityVisitsService } from './city-visits.service';
import { CreateCityVisitDto } from './dtos/create-city-visit.dto';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from 'src/modules/auth/decorators/current-user.decorator';
import { UserFromJwt } from 'src/modules/auth/models/UserFromJwt';
import { DeleteCityVisitDto } from 'src/modules/city-visits/dtos/delete-city-visit.dto';
import { CityVisitEntity } from 'src/modules/city-visits/entities/city-visit.entity';

@Controller('city-visits')
@ApiTags('city visits')
export class CityVisitsController {
  constructor(private readonly cityVisitService: CityVisitsService) {}

  @Post()
  @ApiResponse({ type: CityVisitEntity })
  @ApiBearerAuth()
  async create(
    @Body() createCityVisitDto: CreateCityVisitDto,
    @CurrentUser() currentUser: UserFromJwt,
  ): Promise<CityVisitEntity> {
    return this.cityVisitService.create(createCityVisitDto, currentUser);
  }

  @Delete(':cityId')
  @ApiResponse({ type: CityVisitEntity })
  @ApiBearerAuth()
  remove(
    @Param() param: DeleteCityVisitDto,
    currentUser: UserFromJwt,
  ): Promise<CityVisitEntity> {
    return this.cityVisitService.remove(param.cityId, currentUser);
  }
}
