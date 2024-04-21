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
  ConflictException,
} from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UserClientDto } from './dtos/user-client.dto';
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
import { UserFullInfoDto } from 'src/modules/users/dtos/user-full-info.dto';
import { CityVisitsService } from 'src/modules/city-visits/city-visits.service';
import { UserCityVisitDto } from 'src/modules/city-visits/dtos/user-city-visit.dto';
import { UserSearchDto } from 'src/modules/users/dtos/user-search.dto';
import { UsernameDto } from 'src/modules/users/dtos/username.dto';
import { EmailDto } from 'src/modules/users/dtos/email.dto';
import { PasswordDto } from './dtos/password.dto';

@Controller('users')
@ApiTags('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly mediaService: MediaService,
    private readonly cityVisitsService: CityVisitsService,
  ) {}
  @Post()
  @IsPublic()
  create(@Body() createUserDto: CreateUserDto): Promise<void> {
    return this.usersService.create(createUserDto);
  }

  @Get('send-email-confirmation/:email')
  @ApiResponse({
    status: 200,
    description: 'Confirmation sent',
  })
  @ApiResponse({
    status: 404,
    description: 'No account has been registered with the given email',
  })
  @ApiResponse({
    status: 400,
    description: 'Email has already been verified',
  })
  @IsPublic()
  async sendEmailConfirmation(@Param('email') email: string) {
    return await this.usersService.sendConfirmationEmail(email);
  }

  @Get('send-reset-password/:email')
  @ApiResponse({
    status: 200,
    description: 'Confirmation sent',
  })
  @ApiResponse({
    status: 404,
    description: 'No account has been registered with the given email',
  })
  @ApiResponse({
    status: 400,
    description: 'Email has already been verified',
  })
  @IsPublic()
  async sendPasswordReset(@Param('email') email: string) {
    return await this.usersService.sendPasswordReset(email);
  }

  @Post('reset-password/:token')
  @ApiResponse({
    status: 200,
    description: 'Password has been changed',
  })
  @IsPublic()
  @ApiResponse({
    status: 400,
    description: 'Invalid token',
  })
  async resetPassword(
    @Param('token') token: string,
    @Body() body: PasswordDto,
  ) {
    return await this.usersService.resetPassword(token, body.password);
  }

  @Get('verify-email-confirmation/:token')
  @ApiResponse({
    status: 200,
    description: 'Email has been verified',
  })
  @IsPublic()
  @ApiResponse({
    status: 400,
    description: 'Invalid token',
  })
  async verifyEmailConfirmation(@Param('token') token: string) {
    return await this.usersService.verifyEmailConfirmation(token);
  }

  @Put()
  @ApiBearerAuth()
  @UseInterceptors(FileInterceptor('profilePic'), ClassSerializerInterceptor)
  @ApiConsumes('multipart/form-data')
  @ApiResponse({ type: UserClientDto })
  async update(
    @Body() updateUserDto: UpdateUserDto,
    @UploadedFile() file: Express.Multer.File,
    @CurrentUser() currentUser: UserFromJwt,
  ): Promise<UserClientDto> {
    let imageUrl: string | undefined;

    if (file) {
      const user = await this.usersService.findById(currentUser.id);
      if (user.image) {
        this.mediaService.deleteFile(
          user.image.split('/').pop() as string,
          'profile-pics',
        );
      }
      imageUrl = await this.mediaService.uploadFile(file, 'profile-pics');
    }

    const user = await this.usersService.update(
      { ...updateUserDto, image: imageUrl },
      currentUser,
    );

    return new UserClientDto(user);
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
  @ApiResponse({ type: UserFullInfoDto })
  async me(@CurrentUser() currentUser: UserFromJwt): Promise<UserFullInfoDto> {
    const user = await this.usersService.findByUsername(
      currentUser.username,
      currentUser,
    );

    return new UserFullInfoDto(user);
  }

  @Get('search')
  @IsPublic()
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiResponse({ type: UserEntity, isArray: true })
  async search(@Query() query: UserSearchDto): Promise<UserEntity[]> {
    const users = await this.usersService.search(query);

    return users.map((user) => new UserEntity(user));
  }

  @Put(':username')
  @ApiBearerAuth()
  async changeUsername(
    @Param() params: UsernameDto,
    @CurrentUser() currentUser: UserFromJwt,
  ) {
    await this.usersService.updateUsername(params.username, currentUser);
  }

  @Get(':username')
  @ApiResponse({ type: UserFullInfoDto })
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiBearerAuth()
  @IsPublic()
  async findByUsername(
    @Param('username') username: string,
    @CurrentUser() currentUser: UserFromJwt,
  ): Promise<UserFullInfoDto> {
    const user = await this.usersService.findByUsername(username, currentUser);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return new UserFullInfoDto(user);
  }

  @Get(':username/followers')
  @ApiResponse({ type: UserClientDto, isArray: true })
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiBearerAuth()
  @IsPublic()
  async userFollowers(
    @Param('username') username: string,
    @CurrentUser() currentUser: UserFromJwt,
  ): Promise<UserClientDto[]> {
    const followers = await this.usersService.followers(username, currentUser);

    return followers.map((follower) => new UserClientDto(follower));
  }

  @Get(':username/following')
  @ApiResponse({ type: UserClientDto, isArray: true })
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiBearerAuth()
  @IsPublic()
  async userFollowing(
    @Param('username') username: string,
    @CurrentUser() currentUser: UserFromJwt,
  ): Promise<UserClientDto[]> {
    const followings = await this.usersService.following(username, currentUser);

    return followings.map((following) => new UserClientDto(following));
  }

  @Get(':username/visits')
  @ApiResponse({ type: UserCityVisitDto, isArray: true })
  @IsPublic()
  async userVisits(
    @Param('username') username: string,
  ): Promise<UserCityVisitDto[]> {
    return this.cityVisitsService.getVisitsByUsername(username);
  }

  @Get('username-availability/:username')
  @ApiResponse({
    status: 200,
    description: 'Available',
  })
  @ApiResponse({
    status: 409,
    description: 'Not available',
  })
  @IsPublic()
  async isUsernameAvailable(@Param() params: UsernameDto): Promise<void> {
    const isUsernameAvailable = await this.usersService.isUsernameAvailable(
      params.username,
    );

    if (!isUsernameAvailable) {
      throw new ConflictException('Username not available');
    }
  }

  @Get('email-availability/:email')
  @ApiResponse({
    status: 200,
    description: 'Available',
  })
  @ApiResponse({
    status: 409,
    description: 'Not available',
  })
  @IsPublic()
  async isEmailAvailable(@Param() params: EmailDto): Promise<void> {
    const isEmailAvailable = await this.usersService.isEmailAvailable(
      params.email,
    );

    if (!isEmailAvailable) {
      throw new ConflictException('Email not available');
    }
  }

  @Delete('profile-pic')
  @ApiBearerAuth()
  async deleteProfilePic(
    @CurrentUser() currentUser: UserFromJwt,
  ): Promise<void> {
    const user = await this.usersService.findById(currentUser.id);

    if (!user.image) {
      return;
    }

    const imageUrl = user.image.split('/').pop() as string;

    this.mediaService.deleteFile(imageUrl, 'profile-pics');
    this.usersService.update({ image: null }, currentUser);
  }
}
