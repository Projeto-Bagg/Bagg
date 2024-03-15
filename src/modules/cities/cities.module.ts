import { Module } from '@nestjs/common';
import { CitiesService } from './cities.service';
import { CitiesController } from './cities.controller';
import { PrismaModule } from '../../prisma/prisma.module';
import { CityInterestsModule } from 'src/modules/city-interests/city-interests.module';
import { CityVisitsModule } from 'src/modules/city-visits/city-visits.module';
import { UsersModule } from 'src/modules/users/users.module';

@Module({
  imports: [PrismaModule, CityInterestsModule, CityVisitsModule, UsersModule],
  controllers: [CitiesController],
  providers: [CitiesService],
})
export class CitiesModule {}
