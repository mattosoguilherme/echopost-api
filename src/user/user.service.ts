import { ConflictException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma.service';
import * as bcrypt from 'bcrypt';
import { User } from '@prisma/client';
import { EchoService } from 'src/echo.service';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private echoservice: EchoService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    if (createUserDto.senha !== createUserDto.confirmarSenha) {
      throw new ConflictException('Senhas não conferem');
    }

    const emailExists = await this.prisma.user.findUnique({
      where: { email: createUserDto.email },
    });

    if (emailExists) {
      throw new ConflictException('Email já cadastrado');
    }

    createUserDto['senha'] = await bcrypt.hash(createUserDto.senha, 10);

    const user = await this.prisma.user.create({
      data: createUserDto,
    });
    delete user.senha;

    return user;
  }

  async findAll(): Promise<User[]> {
    return await this.prisma.user.findMany();
  }

  async findOne(id: string): Promise<User> {
    const idExists = await this.prisma.user.findUnique({ where: { id: id } });

    if (!idExists) {
      throw new ConflictException('Usuário não encontrado');
    }

    return idExists;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    await this.echoservice.findUserByEmail(updateUserDto.email);
    await this.echoservice.findUserById(id);
    await this.echoservice.comparePasswords(updateUserDto.senha, id);

    if (updateUserDto.senha !== updateUserDto.confirmarSenha) {
      throw new ConflictException('Senhas não conferem');
    }

    updateUserDto['senha'] = await bcrypt.hash(updateUserDto.senha, 10);

    const user = await this.prisma.user.update({
      where: { id: id },
      data: updateUserDto,
    });

    delete user.senha;

    return;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
