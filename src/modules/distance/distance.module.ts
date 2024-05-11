import { Module } from '@nestjs/common';
import { DistanceService } from './distance.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { DistanceController } from './distance.controller';
import { _CacheModule } from '../cache/cache.module';

@Module({
  imports: [PrismaModule, _CacheModule],
  controllers: [DistanceController],
  providers: [DistanceService],
  exports: [DistanceService],
})
export class DistanceModule {}
