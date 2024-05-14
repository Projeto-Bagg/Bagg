import { Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UserFromJwt } from '../auth/models/UserFromJwt';
import { FriendshipStatusDto } from './dtos/friendship-status.dto';
import { FollowsService } from './follows.service';

@Controller('follows')
@ApiTags('follows')
export class FollowsController {
  constructor(private readonly followsService: FollowsService) {}

  @Post(':userId')
  @ApiBearerAuth()
  @ApiResponse({ status: 201, description: 'Followed user successfully' })
  follow(
    @Param('userId') userId: number,
    @CurrentUser() currentUser: UserFromJwt,
  ): Promise<void> {
    return this.followsService.follow(userId, currentUser);
  }

  @Delete(':userId')
  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'Unfollowed user successfully' })
  unfollow(
    @Param('userId') userId: number,
    @CurrentUser() currentUser: UserFromJwt,
  ): Promise<void> {
    return this.followsService.unfollow(userId, currentUser);
  }

  @Get('friendshipStatus/:userId')
  @ApiBearerAuth()
  @ApiResponse({ type: FriendshipStatusDto })
  friendshipStatus(
    @Param('userId') userId: number,
    @CurrentUser() currentUser: UserFromJwt,
  ): Promise<FriendshipStatusDto> {
    return this.followsService.friendshipStatus(userId, currentUser);
  }
}
