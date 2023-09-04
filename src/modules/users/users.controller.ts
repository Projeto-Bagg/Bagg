import {
  Body,
  Controller,
  Post,
  Get,
  Query,
  Request,
  Put,
  UseGuards,
  Delete,
} from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { UserClient } from './entities/user-client.entity';
import { User } from './entities/user.entity';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UsersRepository } from './users-repository';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UpdatePasswordDto } from './dtos/update-password.dto';
import { DeleteUserDto } from './dtos/delete-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersRepository: UsersRepository) {}

  @Get()
  @ApiResponse({ type: User, isArray: true })
  findMany() {
    return this.usersRepository.findMany();
  }

  @Get('me')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiResponse({ type: UserClient })
  async me(@Request() req) {
    const user = await this.usersRepository.findById(req.user.id);

    return {
      id: user.id,
      displayName: user.displayName,
      username: user.username,
      email:
        user.email.substring(0, 3) +
        '*********' +
        user.email.substring(user.email.indexOf('@'), user.email.length),
    };
  }

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersRepository.create(createUserDto);
  }

  @Put()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async update(@Body() UpdateUserDto: UpdateUserDto, @Request() req) {
    return await this.usersRepository.update(UpdateUserDto, req.user.id);
  }

  @Put('password')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async password(@Body() UpdatePasswordDto: UpdatePasswordDto, @Request() req) {
    return await this.usersRepository.updatePassword(
      UpdatePasswordDto,
      req.user.id,
    );
  }

  @Delete()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async delete(@Query() DeleteUserDto: DeleteUserDto, @Request() req) {
    return await this.usersRepository.delete(DeleteUserDto, req.user.id);
  }
}
