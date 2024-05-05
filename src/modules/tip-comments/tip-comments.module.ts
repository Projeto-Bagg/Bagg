import { Module } from '@nestjs/common';
import { TipCommentsService } from './tip-comments.service';
import { PrismaModule } from '../../prisma/prisma.module';
import { TipCommentsController } from './tip-comments.controller';
import { CityInterestsModule } from 'src/modules/city-interests/city-interests.module';

@Module({
  imports: [PrismaModule, CityInterestsModule],
  providers: [TipCommentsService],
  controllers: [TipCommentsController],
  exports: [TipCommentsService],
})
export class TipCommentsModule {}
