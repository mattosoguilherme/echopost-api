import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { User } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class EchoService {
    constructor (private prisma:PrismaService) {}

    async findUserById(id:string):Promise<User> {
        const user = await this.prisma.user.findUnique({where: {id:id}});
        
        if (!user) {
            throw new NotFoundException('Usuário não encontrado');
        }
        
        return user;
    }

    async findUserByEmail(email:string):Promise<User> {
        const user = await this.prisma.user.findUnique({where: {email:email}});
        
        if (!user) {
            throw new NotFoundException('Email não cadastrado');
        }
        
        return user;
    }

    async comparePasswords(password:string, id:string){
        const user = await this.findUserById(id);

        const isMatch = await bcrypt.compare(password, user.senha);

        if (!isMatch) {
            throw new ConflictException('Senha incorreta');
        }
         
    }
}
