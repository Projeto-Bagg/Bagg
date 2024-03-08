import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ClassSerializerInterceptor,
  UseInterceptors,
  Query,
  UploadedFiles,
} from '@nestjs/common';
import { TipsService } from './tips.service';
import { CreateTipDto } from './dtos/create-tip.dto';
import { UpdateTipDto } from './dtos/update-tip.dto';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { TipEntity } from './entities/tip.entity';
import { FindByUserCityInterestDto } from 'src/modules/tips/dtos/find-by-user-city-interest.dto';
import { CurrentUser } from 'src/modules/auth/decorators/current-user.decorator';
import { UserFromJwt } from 'src/modules/auth/models/UserFromJwt';
import { IsPublic } from 'src/modules/auth/decorators/is-public.decorator';

@Controller('tips')
@ApiTags('tips')
export class TipsController {
  constructor(private readonly tipsService: TipsService) {}

  @Post()
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiConsumes('multipart/form-data')
  @ApiBearerAuth()
  async create(
    @Body() createTipDto: CreateTipDto,
    @CurrentUser() currentUser: UserFromJwt,
    @UploadedFiles() medias: Express.Multer.File[],
  ): Promise<TipEntity> {
    const tip = await this.tipsService.create(
      createTipDto,
      medias,
      currentUser,
    );

    return new TipEntity(tip); // Tem que retornar desse jeito pro serializador de classe funcionar
    // Nesse caso, ele tá excluindo a senha e email do usuário que fez a tip

    // Tem que fazer a parte das mídias depois. Olha a DiaryPostService que é basicamente a mesma coisa
  }
  // A tip também precisa retornar likedBy (número de likes), isLiked e as mídias
  @Get()
  @UseInterceptors(ClassSerializerInterceptor)
  @IsPublic() // IsPublic pra deixar a rota pública. Não precisa do ApiBearerAuth nesse caso
  @ApiResponse({ type: TipEntity, isArray: true })
  async findAll(): Promise<TipEntity[]> {
    const tips = await this.tipsService.findMany();

    return tips.map((tip) => new TipEntity(tip));
  }

  @Get('feed')
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiBearerAuth()
  @ApiResponse({ type: TipEntity, isArray: true })
  async findByUserCityInterest(
    @Query() query: FindByUserCityInterestDto, // Criei um dto pra query. Agora os campos são opcionais
    @CurrentUser() currentUser: UserFromJwt, // E o id do usuário é pego pelo JWT do usuário logado
  ): Promise<TipEntity[]> {
    const tips = await this.tipsService.findByUserCityInterest(
      query.count,
      query.page,
      currentUser,
    );

    return tips.map((tip) => new TipEntity(tip));
  }

  @Get(':id')
  @IsPublic()
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiResponse({ type: TipEntity, isArray: false })
  async findOne(@Param('id') id: string): Promise<TipEntity> {
    const tip = await this.tipsService.findUnique(+id);

    return new TipEntity(tip);
  }

  // @Patch(':id')
  // @UseInterceptors(ClassSerializerInterceptor)
  // @ApiBearerAuth()
  // async update(
  //   @Param('id') id: string,
  //   @Body() updateTipDto: UpdateTipDto,
  // ): Promise<TipEntity> {
  //   const tip = await this.tipsService.update(+id, updateTipDto);

  //   return new TipEntity(tip);
  // }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<boolean> {
    return this.tipsService.delete(+id);
  }
}
