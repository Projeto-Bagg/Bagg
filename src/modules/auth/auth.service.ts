import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UnauthorizedError } from './errors/unauthorized.error';
import { UsersService } from '../users/users.service';
import { UserPayload } from './models/UserPayload';
import { UserToken } from './models/UserToken';
import { UserFromJwt } from './models/UserFromJwt';
import { UserEntity } from '../users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}

  async login(user: UserFromJwt): Promise<UserToken> {
    const payload: UserPayload = {
      sub: user.id,
      username: user.username,
    };

    return await this.getTokens(payload);
  }

  async getTokens(payload: UserPayload): Promise<UserToken> {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: payload.sub,
          username: payload.username,
        },
        {
          secret: process.env.JWT_ACCESS_TOKEN_SECRET,
          expiresIn: '1h',
        },
      ),
      this.jwtService.signAsync(
        {
          sub: payload.sub,
          username: payload.username,
        },
        {
          secret: process.env.JWT_REFRESH_TOKEN_SECRET,
          expiresIn: '7d',
        },
      ),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  async checkRefreshToken(refreshToken: string): Promise<UserEntity> {
    const id = this.jwtService.decode(refreshToken)?.['sub'];
    const user = await this.usersService.findById(id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    try {
      this.jwtService.verify(refreshToken, {
        secret: process.env.JWT_REFRESH_TOKEN_SECRET,
      });
      return user;
    } catch (err: any) {
      if (err.name === 'JsonWebTokenError') {
        throw new UnauthorizedException('JWT Error');
      }
      if (err.name === 'TokenExpiredError') {
        throw new UnauthorizedException('Expired Token');
      }
      throw new UnauthorizedException(err.name);
    }
  }

  async validateUser(
    login: string,
    password: string,
  ): Promise<Omit<UserEntity, 'password'>> {
    let user: UserEntity;

    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(login)) {
      user = await this.usersService.findByEmail(login);
    } else {
      user = await this.usersService.findByUsername(login);
    }

    if (user) {
      const isPasswordValid = await bcrypt.compare(password, user.password);

      const { password: noPassword, ...rest } = user;

      if (isPasswordValid) {
        return {
          ...rest,
        };
      }
    }

    throw new UnauthorizedError(
      'Email address or password provided is incorrect.',
    );
  }
}
