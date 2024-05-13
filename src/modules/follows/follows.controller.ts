import { Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from 'src/modules/auth/decorators/current-user.decorator';
import { UserFromJwt } from 'src/modules/auth/models/UserFromJwt';
import { FriendshipStatusDto } from 'src/modules/follows/dtos/friendship-status.dto';
import { FollowsService } from 'src/modules/follows/follows.service';

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
