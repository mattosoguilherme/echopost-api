import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { PrismaService } from './prisma.service';
import { AuthModule } from './auth/auth.module';
import { EchoService } from './echo.service';

import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ScheduleModule.forRoot (),
    UserModule,
    AuthModule,
    
    
  ],
  controllers: [],
  providers: [PrismaService, EchoService],
})
export class AppModule {}
