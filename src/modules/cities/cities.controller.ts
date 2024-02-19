import { Controller, Get, Param, Query } from '@nestjs/common';
import { CitiesService } from './cities.service';
import { ApiTags } from '@nestjs/swagger';
import { IsPublic } from 'src/modules/auth/decorators/is-public.decorator';
import { CurrentUser } from 'src/modules/auth/decorators/current-user.decorator';
import { UserFromJwt } from 'src/modules/auth/models/UserFromJwt';
import { CityRankingDto } from 'src/modules/cities/entities/city-ranking.dto';
import { CityInterestRankingEntity } from 'src/modules/cities/entities/city-interest-ranking.entity';

@Controller('cities')
@ApiTags('cities')
export class CitiesController {
  constructor(private readonly citiesService: CitiesService) {}

  @Get()
  @IsPublic()
  findAll() {
    return this.citiesService.findAll();
  }

  @Get(':id')
  @IsPublic()
  findById(@Param('id') id: number, @CurrentUser() currentUser: UserFromJwt) {
    return this.citiesService.findById(id, currentUser);
  }

  @Get('ranking/interest')
  @IsPublic()
  ranking(
    @Query() query: CityRankingDto,
  ): Promise<CityInterestRankingEntity[]> {
    return this.citiesService.mostInterestedRanking(query.page, query.count);
  }
}
