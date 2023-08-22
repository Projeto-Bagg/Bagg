import { User } from '@prisma/client';
import { UserFromJwt } from './models/UserFromJwt';
import { UserToken } from './models/UserToken';

export abstract class AuthRepository {
  abstract login(user: UserFromJwt): Promise<UserToken>;
  abstract validateUser(
    email: string,
    password: string,
  ): Promise<Omit<User, 'password'>>;
}
