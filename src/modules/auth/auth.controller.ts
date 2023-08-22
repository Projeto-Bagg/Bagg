import {
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
import { ApiBody, ApiResponse } from '@nestjs/swagger';
import { UserToken } from './models/UserToken';
import { LoginRequestBody } from './models/LoginRequestBody';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @UseGuards(LocalAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ type: UserToken })
  @ApiBody({ type: LoginRequestBody })
  async login(@Request() req: AuthRequest) {
    return this.authService.login(req.user);
  }
}
