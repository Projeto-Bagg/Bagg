import {
  Body,
  Controller,
  Post,
  Get,
  Param,
  Query,
  Put,
  Delete,
  UseInterceptors,
  UploadedFile,
  NotFoundException,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UserClient } from './entities/user-client.entity';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UpdatePasswordDto } from './dtos/update-password.dto';
import { DeleteUserDto } from './dtos/delete-user.dto';
import { UsersService } from './users.service';
import { UserFromJwt } from '../auth/models/UserFromJwt';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { MediaService } from '../media/media.service';
import { IsPublic } from 'src/modules/auth/decorators/is-public.decorator';
import { UserEntity } from 'src/modules/users/entities/user.entity';

@Controller('users')
@ApiTags('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly mediaService: MediaService,
  ) {}
  @Post()
  @IsPublic()
  create(@Body() createUserDto: CreateUserDto): Promise<void> {
    return this.usersService.create(createUserDto);
  }

  @Put()
  @ApiBearerAuth()
  @UseInterceptors(FileInterceptor('profilePic'), ClassSerializerInterceptor)
  @ApiConsumes('multipart/form-data')
  @ApiResponse({ type: UserClient })
  async update(
    @Body() updateUserDto: UpdateUserDto,
    @UploadedFile() file: Express.Multer.File,
    @CurrentUser() currentUser: UserFromJwt,
  ): Promise<UserClient> {
    let imageUrl: string | undefined;

    if (file) {
      const user = await this.usersService.findById(currentUser.id);
      if (user.image) {
        this.mediaService.deleteFile(
          user.image.split('/').pop(),
          'profile-pics',
        );
      }
      imageUrl = await this.mediaService.uploadFile(file, 'profile-pics');
    }

    const user = await this.usersService.update(
      { ...updateUserDto, image: imageUrl },
      currentUser.username,
    );

    return new UserClient(user);
  }

  @Delete()
  @ApiBearerAuth()
  delete(
    @Query() deleteUserDto: DeleteUserDto,
    @CurrentUser() currentUser: UserFromJwt,
  ): Promise<void> {
    return this.usersService.delete(deleteUserDto, currentUser.username);
  }

  @Put('password')
  @ApiBearerAuth()
  password(
    @Body() updatePasswordDto: UpdatePasswordDto,
    @CurrentUser() currentUser: UserFromJwt,
  ): Promise<void> {
    return this.usersService.updatePassword(
      updatePasswordDto,
      currentUser.username,
    );
  }

  @Get('me')
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiBearerAuth()
  @ApiResponse({ type: UserEntity })
  async me(@CurrentUser() userFromJwt: UserFromJwt): Promise<UserEntity> {
    const user = await this.usersService.findById(userFromJwt.id);

    return new UserEntity(user);
  }

  @Get(':username')
  @ApiResponse({ type: UserClient })
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiBearerAuth()
  @IsPublic()
  async findByUsername(
    @Param('username') username: string,
    @CurrentUser() currentUser: UserFromJwt,
  ): Promise<UserClient> {
    const user = await this.usersService.findByUsername(username);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return new UserClient({
      ...user,
      ...(await this.usersService.friendshipCount(user.username)),
      ...(currentUser
        ? await this.usersService.friendshipStatus(username, currentUser)
        : {
            isFollowing: false,
            followedBy: false,
          }),
    });
  }

  @Get(':username/followers')
  @ApiResponse({ type: UserClient, isArray: true })
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiBearerAuth()
  @IsPublic()
  async userFollowers(
    @Param('username') username: string,
    @CurrentUser() currentUser: UserFromJwt,
  ): Promise<UserEntity[]> {
    const followers = await this.usersService.followers(username, currentUser);

    return followers.map((follower) => new UserEntity(follower));
  }

  @Get(':username/following')
  @ApiResponse({ type: UserClient, isArray: true })
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiBearerAuth()
  @IsPublic()
  async userFollowing(
    @Param('username') username: string,
    @CurrentUser() currentUser: UserFromJwt,
  ): Promise<UserEntity[]> {
    const followings = await this.usersService.following(username, currentUser);

    return followings.map((following) => new UserEntity(following));
  }

  @Post('following/:username')
  @ApiBearerAuth()
  follow(
    @Param('username') username: string,
    @CurrentUser() currentUser: UserFromJwt,
  ): Promise<void> {
    return this.usersService.follow(username, currentUser);
  }

  @Delete('following/:username')
  @ApiBearerAuth()
  unfollow(
    @Param('username') username: string,
    @CurrentUser() currentUser: UserFromJwt,
  ): Promise<void> {
    return this.usersService.unfollow(username, currentUser);
  }

  @Delete('profilePic')
  @ApiBearerAuth()
  async deleteProfilePic(
    @CurrentUser() currentUser: UserFromJwt,
  ): Promise<void> {
    const user = await this.usersService.findById(currentUser.id);

    if (!user.image) {
      return;
    }

    const imageUrl = user.image.split('/').pop();

    this.mediaService.deleteFile(imageUrl, 'profile-pics');
    this.usersService.update({ image: null }, currentUser.username);
  }
}
