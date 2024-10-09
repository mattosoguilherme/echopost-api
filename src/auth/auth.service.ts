import { Injectable } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';4
import { JwtService } from '@nestjs/jwt';
import { EchoService } from 'src/echo.service';
import { ResponseDto } from './dto/response.dto';

@Injectable()
export class AuthService {
  constructor(
    private jwt: JwtService,
    private echo: EchoService,
  ) {}

  async login(loginDto: LoginDto):Promise<ResponseDto> {
    const user = await this.echo.findUserByEmail(loginDto.email);

    await this.echo.comparePasswords(loginDto.senha, user.id);

    delete user.senha;

    return {
      token: this.jwt.sign({ email: user.email }),
      user: user,
    };
  }
}
