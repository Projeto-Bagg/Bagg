import { Injectable } from '@nestjs/common';
import {
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common/exceptions';
import { Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { UsersRepository } from './users-repository';
import { User } from './entities/user.entity';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UpdatePasswordDto } from './dtos/update-password.dto';
import { DeleteUserDto } from './dtos/delete-user.dto';

@Injectable()
export class UsersService implements UsersRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto): Promise<void> {
    const alreadyExist = await this.prisma.user.findUnique({
      where: { email: createUserDto.email },
    });

    if (!!alreadyExist) {
      throw new ConflictException('Email not available');
    }

    const data: Prisma.UserCreateInput = {
      ...createUserDto,
      password: await bcrypt.hash(createUserDto.password, 10),
    };

    await this.prisma.user.create({ data });
  }

  async findMany(): Promise<User[]> {
    return await this.prisma.user.findMany();
  }

  async findByEmail(email: string): Promise<User> {
    return await this.prisma.user.findUnique({ where: { email } });
  }

  async findById(id: string): Promise<User> {
    return await this.prisma.user.findUnique({ where: { id } });
  }

  async update(UpdateUserDto: UpdateUserDto, id: string): Promise<void> {
    const data: Prisma.UserUpdateInput = {
      ...UpdateUserDto,
      password: UpdateUserDto.password
        ? await bcrypt.hash(UpdateUserDto.password, 10)
        : undefined,
    };

    await this.prisma.user.update({ data, where: { id } });
  }

  async delete(DeleteUserDto: DeleteUserDto, id: string): Promise<void> {
    const user = await this.prisma.user.findUnique({ where: { id } });

    const validPassword = await bcrypt.compare(
      DeleteUserDto.currentPassword,
      user.password,
    );

    console.log(validPassword);

    if (!validPassword) {
      throw new UnauthorizedException('A senha antiga está incorreta');
    }

    await this.prisma.user.delete({ where: { id } });
  }

  async updatePassword(
    UpdatePasswordDto: UpdatePasswordDto,
    id: string,
  ): Promise<void> {
    const user = await this.prisma.user.findUnique({ where: { id } });

    const validPassword = await bcrypt.compare(
      UpdatePasswordDto.currentPassword,
      user.password,
    );

    if (!validPassword) {
      throw new UnauthorizedException('A senha antiga está incorreta');
    }

    const password = await bcrypt.hash(UpdatePasswordDto.newPassword, 10);

    await this.prisma.user.update({ data: { password }, where: { id } });
  }
}
