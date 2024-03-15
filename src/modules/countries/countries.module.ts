import { Module } from '@nestjs/common';
import { CountriesService } from './countries.service';
import { CountriesController } from './countries.controller';
import { PrismaModule } from '../../prisma/prisma.module';
import { CityVisitsModule } from 'src/modules/city-visits/city-visits.module';
import { CityInterestsModule } from 'src/modules/city-interests/city-interests.module';
import { UsersModule } from 'src/modules/users/users.module';

@Module({
  imports: [PrismaModule, CityVisitsModule, CityInterestsModule, UsersModule],
  controllers: [CountriesController],
  providers: [CountriesService],
})
export class CountriesModule {}
