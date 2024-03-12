import { Controller, Post, Param, Delete } from '@nestjs/common';
import { CityInterestsService } from './city-interests.service';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from 'src/modules/auth/decorators/current-user.decorator';
import { UserFromJwt } from 'src/modules/auth/models/UserFromJwt';
import { CityInterestEntity } from 'src/modules/city-interests/entities/city-interest.entity';

@Controller('city-interests')
@ApiTags('city interests')
export class CityInterestsController {
  constructor(private readonly cityInterestsService: CityInterestsService) {}

  @Post(':cityId')
  @ApiBearerAuth()
  @ApiResponse({ type: CityInterestEntity })
  create(
    @Param('cityId') cityId: number,
    @CurrentUser() currentUser: UserFromJwt,
  ): Promise<CityInterestEntity> {
    return this.cityInterestsService.create(cityId, currentUser);
  }

  @Delete(':cityId')
  @ApiBearerAuth()
  delete(
    @Param('cityId') cityId: number,
    @CurrentUser() currentUser: UserFromJwt,
  ): Promise<void> {
    return this.cityInterestsService.remove(cityId, currentUser);
  }
}
