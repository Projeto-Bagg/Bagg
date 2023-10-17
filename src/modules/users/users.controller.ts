import {
  Body,
  Controller,
  Post,
  Get,
  Param,
  Query,
  Put,
  UseGuards,
  Delete,
  UseInterceptors,
  UploadedFile,
  NotFoundException,
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
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UpdatePasswordDto } from './dtos/update-password.dto';
import { DeleteUserDto } from './dtos/delete-user.dto';
import { UsersService } from './users.service';
import { UserFromJwt } from '../auth/models/UserFromJwt';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { MediaService } from '../media/media.service';

@Controller('users')
@ApiTags('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly mediaService: MediaService,
  ) {}
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Put()
  @ApiBearerAuth()
  @UseInterceptors(FileInterceptor('profilePic'))
  @ApiConsumes('multipart/form-data')
  @UseGuards(JwtAuthGuard)
  async update(
    @Body() updateUserDto: UpdateUserDto,
    @UploadedFile() file: Express.Multer.File,
    @CurrentUser() userFromJwt: UserFromJwt,
  ) {
    let imageUrl: string | undefined;

    if (file) {
      const user = await this.usersService.findById(userFromJwt.id);
      if (user.image) {
        this.mediaService.deleteFile(
          user.image.split('/').pop(),
          'profile-pics',
        );
      }
      imageUrl = await this.mediaService.uploadFile(file, 'profile-pics');
    }

    return await this.usersService.update(
      { ...updateUserDto, image: imageUrl },
      userFromJwt.id,
    );
  }

  @Delete()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  delete(
    @Query() DeleteUserDto: DeleteUserDto,
    @CurrentUser() user: UserFromJwt,
  ) {
    return this.usersService.delete(DeleteUserDto, user.id);
  }

  @Put('password')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  password(
    @Body() UpdatePasswordDto: UpdatePasswordDto,
    @CurrentUser() user: UserFromJwt,
  ) {
    return this.usersService.updatePassword(UpdatePasswordDto, user.id);
  }

  @Get('me')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiResponse({ type: UserClient })
  async me(@CurrentUser() userReq: UserFromJwt) {
    const user = await this.usersService.findById(userReq.id);
    const follows = await this.usersService.friendshipCount(user.id);

    const { email, password, emailVerified, ...rest } = user;

    return {
      ...rest,
      ...follows,
    };
  }

  @Get('/followers')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiResponse({ type: UserClient, isArray: true })
  followers(@CurrentUser() user: UserFromJwt) {
    return this.usersService.followers(user.id);
  }

  @Get('/following')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiResponse({ type: UserClient, isArray: true })
  following(@CurrentUser() user: UserFromJwt) {
    return this.usersService.following(user.id);
  }

  @Get('friendship/:username')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  friendshipStatus(
    @Param('username') username: string,
    @CurrentUser() user: UserFromJwt,
  ) {
    return this.usersService.friendshipStatus(username, user.id);
  }

  // @Get('friendship-count')
  // @ApiBearerAuth()
  // @UseGuards(JwtAuthGuard)
  // async friendshipStatus(@CurrentUser() user: UserFromJwt) {
  //   return this.usersService.friendshipCount(user.id);
  // }

  @Get(':username')
  @ApiResponse({ type: UserClient })
  async findByUsername(@Param('username') username: string) {
    const user = await this.usersService.findByUsername(username);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const follows = await this.usersService.friendshipCount(user.id);

    const { email, password, emailVerified, ...rest } = user;

    return {
      ...rest,
      ...follows,
    };
  }

  @Post('following/:username')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  follow(
    @Param('username') username: string,
    @CurrentUser() user: UserFromJwt,
  ) {
    return this.usersService.follow(username, user.id);
  }

  @Delete('following/:username')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  unfollow(
    @Param('username') username: string,
    @CurrentUser() user: UserFromJwt,
  ) {
    return this.usersService.unfollow(username, user.id);
  }

  @Delete('profilePic')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async deleteProfilePic(@CurrentUser() userFromJwt: UserFromJwt) {
    const user = await this.usersService.findById(userFromJwt.id);

    if (!user.image) {
      return;
    }

    const imageUrl = user.image.split('/').pop();

    this.mediaService.deleteFile(imageUrl, 'profile-pics');
    this.usersService.update({ image: null }, userFromJwt.id);
  }
}
