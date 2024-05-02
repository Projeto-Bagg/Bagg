import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { UserPayload } from './models/UserPayload';
import { UserToken } from './models/UserToken';
import { UserFromJwt } from './models/UserFromJwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { AccountEntity } from 'src/modules/account/entities/account.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
    private readonly prismaService: PrismaService,
  ) {}

  async login(user: UserFromJwt): Promise<UserToken> {
    const payload: UserPayload = {
      sub: user.id,
      role: user.role,
    };

    return await this.getTokens(payload);
  }

  async getTokens(payload: UserPayload): Promise<UserToken> {
    const user = await this.usersService.findById(payload.sub);
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: payload.sub,
          role: payload.role,
          hasEmailBeenVerified: user.emailVerified,
        },
        {
          secret: process.env.JWT_ACCESS_TOKEN_SECRET,
          expiresIn: '1h',
        },
      ),
      this.jwtService.signAsync(
        {
          sub: payload.sub,
          role: payload.role,
          hasEmailBeenVerified: user.emailVerified,
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

  async checkRefreshToken(refreshToken: string): Promise<AccountEntity> {
    const id = this.jwtService.decode(refreshToken)?.['sub'];
    const account = await this.prismaService.account.findUnique({
      where: { id },
    });

    if (!account) {
      throw new NotFoundException('User not found');
    }

    try {
      this.jwtService.verify(refreshToken, {
        secret: process.env.JWT_REFRESH_TOKEN_SECRET,
      });
      return account;
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

  async validateUser(login: string, password: string): Promise<AccountEntity> {
    const account = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(login)
      ? await this.prismaService.account.findUnique({ where: { email: login } })
      : await this.prismaService.account.findFirst({
          where: { user: { username: login } },
        });

    if (account) {
      const isPasswordValid = await bcrypt.compare(password, account.password);

      if (isPasswordValid) {
        return account;
      }
    }

    throw new UnauthorizedException(
      'Email address or password provided is incorrect.',
    );
  }
}
