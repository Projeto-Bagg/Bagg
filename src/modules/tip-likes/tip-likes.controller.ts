import { Controller, Post, Delete, Param } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { IsPublic } from 'src/modules/auth/decorators/is-public.decorator';
import { TipLikesService } from './tip-likes.service';
import { TipLikeEntity } from './entities/tip-like.entity';
import { UserFromJwt } from 'src/modules/auth/models/UserFromJwt';
import { CurrentUser } from 'src/modules/auth/decorators/current-user.decorator';

@Controller('tip-likes')
@ApiTags('tip-likes')
export class TipLikesController {
  constructor(private readonly tipLikesService: TipLikesService) {}

  @Post(':id')
  @IsPublic()
  async create(
    @Param('id') id: number,
    @CurrentUser() currentUser: UserFromJwt,
  ): Promise<void> {
    return this.tipLikesService.create(id, currentUser);
  }

  @Delete(':id')
  @IsPublic()
  @ApiResponse({ type: TipLikeEntity })
  async remove(
    @Param('id') id: number,
    @CurrentUser() currentUser: UserFromJwt,
  ): Promise<void> {
    return this.tipLikesService.remove(id, currentUser);
  }
}
