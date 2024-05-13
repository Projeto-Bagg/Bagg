import { Controller, Post, Param, Delete } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from 'src/modules/auth/decorators/current-user.decorator';
import { UserFromJwt } from 'src/modules/auth/models/UserFromJwt';
import { DiaryPostLikesService } from 'src/modules/diary-post-likes/diary-post-likes.service';

@Controller('diary-post-likes')
@ApiTags('diary post likes')
export class DiaryPostLikesController {
  constructor(private readonly diaryPostLikeService: DiaryPostLikesService) {}

  @Post(':id')
  @ApiBearerAuth()
  @ApiResponse({ status: 201, description: 'Like created successfully' })
  like(
    @Param('id') id: number,
    @CurrentUser() currentUser: UserFromJwt,
  ): Promise<void> {
    return this.diaryPostLikeService.like(id, currentUser);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'Like deleted successfully' })
  unlike(
    @Param('id') id: number,
    @CurrentUser() currentUser: UserFromJwt,
  ): Promise<void> {
    return this.diaryPostLikeService.unlike(id, currentUser);
  }
}
