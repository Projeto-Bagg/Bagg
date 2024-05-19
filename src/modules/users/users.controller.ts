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
import { IsPublic } from '../auth/decorators/is-public.decorator';
import { UserEntity } from './entities/user.entity';
import { UserFullInfoDto } from './dtos/user-full-info.dto';
import { CityVisitsService } from '../city-visits/city-visits.service';
import { UserCityVisitDto } from '../city-visits/dtos/user-city-visit.dto';
import { UserSearchDto } from './dtos/user-search.dto';
import { UsernameDto } from './dtos/username.dto';
import { EmailDto } from './dtos/email.dto';
import { PasswordDto } from './dtos/password.dto';
import { IsEmailVerificationUnneeded } from '../auth/decorators/is-email-verification-unneeded.decorator';

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
  @ApiResponse({ status: 200, description: 'User created successfully' })
  @ApiResponse({
    status: 409,
    description: 'Username or email already registered',
  })
  create(@Body() createUserDto: CreateUserDto): Promise<void> {
    return this.usersService.create(createUserDto);
  }

  @Get('send-email-confirmation')
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
  @ApiBearerAuth()
  @IsEmailVerificationUnneeded()
  async sendEmailConfirmation(@CurrentUser() currentUser: UserFromJwt) {
    return await this.usersService.sendConfirmationEmail(currentUser);
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

  @Get('is-email-verified')
  @ApiResponse({ status: 200, description: 'Email has been verified' })
  @ApiResponse({ status: 400, description: "Email hasn't been verified" })
  @ApiBearerAuth()
  @IsEmailVerificationUnneeded()
  async isEmailVerified(
    @CurrentUser() currentUser: UserFromJwt,
  ): Promise<void> {
    return await this.usersService.isEmailVerified(currentUser);
  }

  @Get('verify-email-confirmation/:token')
  @ApiResponse({
    status: 200,
    description: 'Email has been verified',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid token',
  })
  @IsPublic()
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

    return await this.usersService.update(
      { ...updateUserDto, image: imageUrl },
      currentUser,
    );
  }

  @Post('/delete')
  @ApiBearerAuth()
  @ApiResponse({
    status: 404,
    description: 'Account does not exist',
  })
  @ApiResponse({
    status: 403,
    description: 'Incorrect password',
  })
  @ApiResponse({
    status: 200,
    description: 'Deleted account',
  })
  delete(
    @Body() deleteUserDto: DeleteUserDto,
    @CurrentUser() currentUser: UserFromJwt,
  ): Promise<void> {
    return this.usersService.delete(deleteUserDto, currentUser);
  }

  @Put('password')
  @ApiBearerAuth()
  @ApiResponse({
    status: 404,
    description: 'Account does not exist',
  })
  @ApiResponse({
    status: 403,
    description: 'Incorrect password',
  })
  @ApiResponse({
    status: 200,
    description: 'Changed password successfully!',
  })
  password(
    @Body() updatePasswordDto: UpdatePasswordDto,
    @CurrentUser() currentUser: UserFromJwt,
  ): Promise<void> {
    return this.usersService.updatePassword(updatePasswordDto, currentUser);
  }

  @Get('me')
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiBearerAuth()
  @ApiResponse({ type: UserFullInfoDto })
  async me(@CurrentUser() currentUser: UserFromJwt): Promise<UserFullInfoDto> {
    const user = await this.usersService.findById(currentUser.id);

    return await this.usersService.getUserFullInfo(user, currentUser);
  }

  @Get('search')
  @IsPublic()
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiResponse({ type: UserEntity, isArray: true })
  async search(@Query() query: UserSearchDto): Promise<UserEntity[]> {
    return await this.usersService.search(query);
  }

  @Put(':username')
  @ApiBearerAuth()
  @ApiResponse({
    status: 409,
    description: 'Username already registered',
  })
  @ApiResponse({ status: 200 })
  async changeUsername(
    @Param() params: UsernameDto,
    @CurrentUser() currentUser: UserFromJwt,
  ): Promise<void> {
    await this.usersService.updateUsername(params.username, currentUser);
  }

  @Get(':username')
  @ApiResponse({ type: UserFullInfoDto, status: 200 })
  @ApiResponse({ status: 404, description: 'User does not exist' })
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiBearerAuth()
  @IsPublic()
  async findByUsername(
    @Param('username') username: string,
    @CurrentUser() currentUser: UserFromJwt,
  ): Promise<UserFullInfoDto> {
    const user = await this.usersService.findByUsername(username);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return await this.usersService.getUserFullInfo(user, currentUser);
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
    return await this.usersService.followers(username, currentUser);
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
    return await this.usersService.following(username, currentUser);
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
  @ApiResponse({
    description: 'Profile picture deleted successfully',
  })
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
