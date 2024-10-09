import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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

    delete createUserDto.confirmarSenha;

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
    const user = await this.echoservice.findUserById(id);

    delete user.senha;

    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    // verificando se o email existe
    await this.echoservice.emailValid(updateUserDto.email);
    // verificando se id existe
    await this.echoservice.findUserById(id);

    if (updateUserDto.atualsenha) {
      await this.echoservice.comparePasswords(updateUserDto.atualsenha, id);

      if (updateUserDto.novaSenha !== updateUserDto.confirmarSenha) {
        throw new ConflictException('Senhas não conferem');
      }

      updateUserDto['novaSenha'] = await bcrypt.hash(
        updateUserDto.novaSenha,
        10,
      );

      const user = await this.prisma.user.update({
        where: { id: id },
        data: {
          nome: updateUserDto.nome,
          email: updateUserDto.email,
          senha: updateUserDto.novaSenha,
        },
      });
      delete user.senha;

      return user;
    }

    const user = await this.prisma.user.update({
      where: { id: id },
      data: updateUserDto,
    });

    delete user.senha;

    return;
  }

  async remove(id: string): Promise<User> {
    await this.echoservice.findUserById(id);

    return await this.prisma.user.delete({
      where: { id: id },
    });
  }
}
