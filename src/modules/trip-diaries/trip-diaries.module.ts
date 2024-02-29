import { Module } from '@nestjs/common';
import { TripDiariesService } from './trip-diaries.service';
import { TripDiariesController } from './trip-diaries.controller';
import { PrismaModule } from '../../prisma/prisma.module';
import { UsersModule } from 'src/modules/users/users.module';

@Module({
  imports: [PrismaModule, UsersModule],
  controllers: [TripDiariesController],
  providers: [TripDiariesService],
})
export class TripDiariesModule {}
