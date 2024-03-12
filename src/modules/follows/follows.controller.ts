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

  @Post(':username')
  @ApiBearerAuth()
  follow(
    @Param('username') username: string,
    @CurrentUser() currentUser: UserFromJwt,
  ): Promise<void> {
    return this.followsService.follow(username, currentUser);
  }

  @Delete(':username')
  @ApiBearerAuth()
  unfollow(
    @Param('username') username: string,
    @CurrentUser() currentUser: UserFromJwt,
  ): Promise<void> {
    return this.followsService.unfollow(username, currentUser);
  }

  @Get('friendshipStatus/:username')
  @ApiBearerAuth()
  @ApiResponse({ type: FriendshipStatusDto })
  friendshipStatus(
    @Param('username') username: string,
    @CurrentUser() currentUser: UserFromJwt,
  ): Promise<FriendshipStatusDto> {
    return this.followsService.friendshipStatus(username, currentUser);
  }
}
