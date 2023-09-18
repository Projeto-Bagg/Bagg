import { Injectable } from '@nestjs/common';
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
    };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async validateUser(
    email: string,
    password: string,
  ): Promise<Omit<UserEntity, 'password'>> {
    const user = await this.usersService.findByEmail(email);

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
