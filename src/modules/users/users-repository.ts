import { CreateUserDto } from './dtos/create-user.dto';
import { DeleteUserDto } from './dtos/delete-user.dto';
import { UpdatePasswordDto } from './dtos/update-password.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { User } from './entities/user.entity';

export abstract class UsersRepository {
  abstract create(createUserDto: CreateUserDto): Promise<void>;
  abstract findMany(): Promise<User[]>;
  abstract findByEmail(email: string): Promise<User>;
  abstract findById(id: number): Promise<User>;
  abstract update(UpdateUserDto: UpdateUserDto, id: number): Promise<void>;
  abstract updatePassword(
    UpdatePasswordDto: UpdatePasswordDto,
    id: number,
  ): Promise<void>;
  abstract delete(DeleteUserDto: DeleteUserDto, id: number): Promise<void>;
}
