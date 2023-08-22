import { CreateUserDto } from './dtos/create-user.dto';
import { DeleteUserDto } from './dtos/delete-user.dto';
import { UpdatePasswordDto } from './dtos/update-password.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { User } from './entities/user.entity';

export abstract class UsersRepository {
  abstract create(createUserDto: CreateUserDto): Promise<void>;
  abstract findMany(): Promise<User[]>;
  abstract findByEmail(email: string): Promise<User>;
  abstract findById(id: string): Promise<User>;
  abstract update(UpdateUserDto: UpdateUserDto, id: string): Promise<void>;
  abstract updatePassword(
    UpdatePasswordDto: UpdatePasswordDto,
    id: string,
  ): Promise<void>;
  abstract delete(DeleteUserDto: DeleteUserDto, id: string): Promise<void>;
}
