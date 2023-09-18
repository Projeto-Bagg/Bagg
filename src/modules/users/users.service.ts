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
import nodemailer from 'nodemailer';
import jwt from 'jsonwebtoken';
import { userInfo } from 'os';

interface JwtPayload {
  email: string;
}

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

  async findById(id: number): Promise<User> {
    return await this.prisma.user.findUnique({ where: { id } });
  }

  async update(UpdateUserDto: UpdateUserDto, id: number): Promise<void> {
    const data: Prisma.UserUpdateInput = {
      ...UpdateUserDto,
      password: UpdateUserDto.password
        ? await bcrypt.hash(UpdateUserDto.password, 10)
        : undefined,
    };

    await this.prisma.user.update({ data, where: { id } });
  }

  async delete(DeleteUserDto: DeleteUserDto, id: number): Promise<void> {
    const user = await this.prisma.user.findUnique({ where: { id } });

    const validPassword = await bcrypt.compare(
      DeleteUserDto.currentPassword,
      user.password,
    );

    if (!validPassword) {
      throw new UnauthorizedException('A senha antiga está incorreta');
    }

    await this.prisma.user.delete({ where: { id } });
  }

  async updatePassword(
    UpdatePasswordDto: UpdatePasswordDto,
    id: number,
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

  async sendConfirmationEmail(id: number): Promise<boolean> {
    const user = await this.prisma.user.findUnique({ where: { id } });

    if (!user.emailVerified) {
      //usar alguma biblioteca de template para passar o token para o html que vai ter no email
      const verificationToken = jwt.sign(
        {
          email: user.email,
        },
        process.env.JWT_SECRET,
        { expiresIn: 60 * 60 * 24 },
      );
      //precisa permitir que apps menos seguros usem seu gmail por conta da falta do oauth, se não não vai funcionar
      const mailTransporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL,
          pass: process.env.EMAIL_PASSWORD,
        },
      });

      const mailDetails = {
        from: process.env.EMAIL,
        to: user.email,
        subject: 'pretty subject',
        text: 'pretty text',
      };

      mailTransporter.sendMail(mailDetails, function (err) {
        if (err) {
          return false;
        } else {
          return true;
        }
      });
    } else {
      return false;
    }
    return true;
  }

  async verifyConfirmationEmail(token: string): Promise<boolean> {
    jwt.verify(
      token,
      process.env.JWT_SECRET,
      async function (err, decoded: JwtPayload) {
        if (err) {
          return false;
        } else {
          await this.prisma.user.update({
            data: { emailVerified: true },
            where: { email: decoded.email },
          });
          return true;
        }
      },
    );
    return false;
  }
}
