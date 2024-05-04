import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { JwtModule } from '@nestjs/jwt';
import { MediaModule } from '../media/media.module';
import { CityVisitsModule } from 'src/modules/city-visits/city-visits.module';
import { FollowsModule } from 'src/modules/follows/follows.module';
import { EmailsModule } from '../emails/emails.module';

@Module({
  imports: [
    PrismaModule,
    JwtModule,
    MediaModule,
    CityVisitsModule,
    FollowsModule,
    EmailsModule,
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
