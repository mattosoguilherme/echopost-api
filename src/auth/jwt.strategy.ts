import { Injectable, NotFoundException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private prismaService: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: true,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: { email: string }) {
    const validatedUser = await this.prismaService.user.findUnique({
      where: { email: payload.email },
    });

    if (!validatedUser) {
      throw new NotFoundException('Usuário não encontrado ou não autenticado');
    }

    return validatedUser;
  }
}