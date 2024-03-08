import {
  Controller,
  Get,
  ClassSerializerInterceptor,
  UseInterceptors,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { IsPublic } from 'src/modules/auth/decorators/is-public.decorator';
import { TipLikesService } from './tip-likes.service';
import { TipLikeEntity } from './entities/tip-like.entity';
import { CreateTipLikeDto } from './dtos/create-tip-like.dto';

@Controller('tip-likes')
@ApiTags('tip-likes')
export class TipLikesController {
  constructor(private readonly tipLikesService: TipLikesService) {}
  @Get()
  @UseInterceptors(ClassSerializerInterceptor)
  @IsPublic()
  @ApiResponse({ type: TipLikeEntity })
  async create(createTipLikeDto: CreateTipLikeDto): Promise<TipLikeEntity> {
    return this.tipLikesService.create(createTipLikeDto);
  }

  @Get()
  @UseInterceptors(ClassSerializerInterceptor)
  @IsPublic()
  @ApiResponse({ type: TipLikeEntity })
  async remove(id: number): Promise<TipLikeEntity> {
    return this.tipLikesService.remove(id);
  }
}
