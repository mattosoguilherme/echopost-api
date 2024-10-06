import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PrismaService } from 'src/prisma.service';
import { EchoService } from 'src/echo.service';

@Module({
  controllers: [UserController],
  providers: [UserService,PrismaService,EchoService],
})
export class UserModule {}
