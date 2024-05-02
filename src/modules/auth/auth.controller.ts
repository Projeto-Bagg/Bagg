import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { AuthRequest } from './models/AuthRequest';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserToken } from './models/UserToken';
import { IsPublic } from 'src/modules/auth/decorators/is-public.decorator';
import { LoginRequestDto } from 'src/modules/auth/dtos/login-request.dto';
import { RefreshTokenDto } from 'src/modules/auth/dtos/refresh-token.dto';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @UseGuards(LocalAuthGuard)
  @IsPublic()
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ type: UserToken })
  @ApiBody({ type: LoginRequestDto })
  async login(@Request() req: AuthRequest): Promise<UserToken> {
    return this.authService.login(req.user);
  }

  @Post('refresh')
  @IsPublic()
  @ApiResponse({ type: UserToken })
  @ApiBody({ type: RefreshTokenDto })
  async refreshToken(@Body() body: RefreshTokenDto): Promise<UserToken> {
    const account = await this.authService.checkRefreshToken(body.refreshToken);

    return this.authService.getTokens({
      sub: account.id,
      role: account.admin ? 'ADMIN' : 'USER',
    });
  }
}
