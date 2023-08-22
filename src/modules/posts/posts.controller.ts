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
import { ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PostsRepository } from './posts-repository';
import { CreatePostDto } from './dtos/create-post.dto';
import { UpdatePostDto } from './dtos/update-post.dto';
import { DeletePostDto } from './dtos/delete-post.dto';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsRepository: PostsRepository) {}

  @Get()
  @ApiResponse({ type: Post, isArray: true })
  findMany() {
    return this.postsRepository.findMany();
  }

  @Post()
  create(@Body() createUserDto: CreatePostDto) {
    return this.postsRepository.create(createUserDto);
  }

  @Put()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async update(@Body() UpdatePostDto: UpdatePostDto, @Request() req) {
    return await this.postsRepository.update(UpdatePostDto);
  }

  @Delete()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async delete(@Query() DeletePostDto: DeletePostDto, @Request() req) {
    return await this.postsRepository.delete(DeletePostDto);
  }
}
