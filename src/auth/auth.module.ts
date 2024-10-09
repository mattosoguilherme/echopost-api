import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { EchoService } from 'src/echo.service';
import { PrismaService } from 'src/prisma.service';
import { RolesGuard } from './guards/roles.guard';
import { JwtStrategy } from './jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1d' }, // 1 day
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, EchoService, PrismaService, RolesGuard, JwtStrategy],
})
export class AuthModule {}
