import { Controller, Post, Param, Delete } from '@nestjs/common';
import { CityInterestsService } from './city-interests.service';
import { ApiTags } from '@nestjs/swagger';
import { CurrentUser } from 'src/modules/auth/decorators/current-user.decorator';
import { UserFromJwt } from 'src/modules/auth/models/UserFromJwt';

@Controller('cityInterests')
@ApiTags('city interests')
export class CityInterestsController {
  constructor(private readonly cityInterestsService: CityInterestsService) {}

  @Post(':cityId')
  create(
    @Param('cityId') cityId: number,
    @CurrentUser() currentUser: UserFromJwt,
  ) {
    return this.cityInterestsService.create(cityId, currentUser);
  }

  @Delete(':cityId')
  delete(
    @Param('cityId') cityId: number,
    @CurrentUser() currentUser: UserFromJwt,
  ) {
    return this.cityInterestsService.remove(cityId, currentUser);
  }
}
