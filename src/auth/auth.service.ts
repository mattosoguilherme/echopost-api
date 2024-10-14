import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import axios from 'axios';
import { JwtService } from '@nestjs/jwt';
import { EchoService } from 'src/echo.service';
import { ResponseDto } from './dto/response.dto';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/prisma.service';
import { Platform, Token } from '@prisma/client';
import { google } from 'googleapis';

@Injectable()
export class AuthService {
  constructor(
    private jwt: JwtService,
    private echo: EchoService,
    private configService: ConfigService,
    private prisma: PrismaService,
  ) {}

  async login(loginDto: LoginDto): Promise<ResponseDto> {
    const user = await this.echo.findUserByEmail(loginDto.email);

    await this.echo.comparePasswords(loginDto.senha, user.id);

    delete user.senha;

    return {
      token: this.jwt.sign({ email: user.email }),
      user: user,
    };
  }

  getYoutubeAuthUrl(): string {
    const OAuthClient = new google.auth.OAuth2(
      process.env.YOUTUBE_CLIENT_ID,
      process.env.YOUTUBE_CLIENT_SECRET,
      process.env.YOUTUBE_REDIRECT_URI,
    );

    const url = OAuthClient.generateAuthUrl({
      access_type: 'offline',
      scope: ['https://www.googleapis.com/auth/youtube.upload'],
    });

    return url;
  }

  async getYoutubeToken(code: string): Promise<Token> {
    try {
      const response = await axios.post(
        'https://oauth2.googleapis.com/token',
        {
          code,
          client_id: process.env.YOUTUBE_CLIENT_ID,
          client_secret: process.env.YOUTUBE_CLIENT_SECRET,
          redirect_uri: process.env.YOUTUBE_REDIRECT_URI,
          grant_type: 'authorization_code',
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );

      const { access_token, refresh_token, expires_in, scope, token_type } =
        response.data;

        console.log(response.data);
        
      const expireAt = new Date();
      expireAt.setSeconds(expireAt.getSeconds() + expires_in);

      const tokenEntity = await this.prisma.token.create({ 
        data:{
        
              platform: Platform.youtube,
              accessToken: access_token,
              refreshToken: refresh_token,
              expiresAt: expireAt,
              scope: scope,
              tokenType: token_type,
            },
      
        })
      

      return tokenEntity;
    
    } catch (error) {
      console.error(
        'Erro ao obter token do YouTube:',
        error.response?.data || error.message,
      );
      throw new HttpException(
        'Erro ao obter token do YouTube',
        HttpStatus.BAD_REQUEST,
      );
    }

    return;
  }

  async getToken(platform: Platform): Promise<Token> {
    const token = await this.prisma.token.findFirst({
      where: { platform },
      orderBy: { updatedAt: 'desc' }, // Obter o token mais recente
    });

    if (!token) {
      throw new HttpException(
        `Token para ${platform} não encontrado`,
        HttpStatus.NOT_FOUND,
      );
    }

    // Verificar se o token expirou e renová-lo se necessário
    if (token.expiresAt && token.expiresAt < new Date()) {
      // Implementar lógica de renovação
      if (platform === Platform.youtube && token.refreshToken) {
        const newTokens = await this.refreshYoutubeToken(token.refreshToken);
        await this.prisma.token.update({
          where: { id: token.id },
          data: {
            accessToken: newTokens.access_token,
            refreshToken: newTokens.refresh_token || token.refreshToken,
            expiresAt: new Date(Date.now() + newTokens.expires_in * 1000),
            scope: newTokens.scope,
            tokenType: newTokens.token_type,
          },
        });
        return await this.prisma.token.findUnique({ where: { id: token.id } });
      }
      // Adicione renovação para outras plataformas conforme necessário
    }

    return token;
  }

  // Método de renovação de token para YouTube
  async refreshYoutubeToken(refreshToken: string): Promise<any> {
    const clientId = this.configService.get<string>(
      process.env.YOUTUBE_CLIENT_ID,
    );
    const clientSecret = this.configService.get<string>(
      process.env.YOUTUBE_CLIENT_SECRET,
    );

    try {
      const response = await axios.post(
        'https://oauth2.googleapis.com/token',
        {
          client_id: clientId,
          client_secret: clientSecret,
          refresh_token: refreshToken,
          grant_type: 'refresh_token',
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );
      return response.data;
    } catch (error) {
      console.error(
        'Erro ao renovar token do YouTube:',
        error.response?.data || error.message,
      );
      throw new HttpException(
        'Erro ao renovar token do YouTube',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
