import {
  Body,
  Controller,
  Post,
  Get,
  Query,
  Put,
  UseGuards,
  Delete,
} from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserClient } from './entities/user-client.entity';
import { UserEntity } from './entities/user.entity';
import { UpdateUserDto } from './dtos/update-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UpdatePasswordDto } from './dtos/update-password.dto';
import { DeleteUserDto } from './dtos/delete-user.dto';
import { UsersService } from './users.service';
import { UserFromJwt } from '../auth/models/UserFromJwt';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller('users')
@ApiTags('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiResponse({ type: UserEntity, isArray: true })
  findMany() {
    return this.usersService.findMany();
  }

  @Get('me')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiResponse({ type: UserClient })
  async me(@CurrentUser() userReq: UserFromJwt) {
    const user = await this.usersService.findById(userReq.id);

    return {
      id: user.id,
      fullName: user.fullName,
      username: user.username,
      email:
        user.email.substring(0, 3) +
        '*********' +
        user.email.substring(user.email.indexOf('@'), user.email.length),
    };
  }

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Put()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async update(
    @Body() UpdateUserDto: UpdateUserDto,
    @CurrentUser() user: UserFromJwt,
  ) {
    return await this.usersService.update(UpdateUserDto, user.id);
  }

  @Put('password')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async password(
    @Body() UpdatePasswordDto: UpdatePasswordDto,
    @CurrentUser() user: UserFromJwt,
  ) {
    return await this.usersService.updatePassword(UpdatePasswordDto, user.id);
  }

  @Delete()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async delete(
    @Query() DeleteUserDto: DeleteUserDto,
    @CurrentUser() user: UserFromJwt,
  ) {
    return await this.usersService.delete(DeleteUserDto, user.id);
  }
}
