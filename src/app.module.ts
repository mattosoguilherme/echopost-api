import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { PrismaService } from './prisma.service';
import { AuthModule } from './auth/auth.module';
import { EchoService } from './echo.service';

@Module({
  imports: [UserModule, AuthModule],
  controllers: [],
  providers: [PrismaService, EchoService],
})
export class AppModule {}
