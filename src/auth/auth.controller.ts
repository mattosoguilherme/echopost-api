import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Roles } from './decorators/roles.decorator';
import { Role } from 'src/utils/roles.enum';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from './guards/roles.guard';
import Logged from './decorators/logged.decorator';
import { User } from '@prisma/client';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  login(@Body() login: LoginDto) {
    return this.authService.login(login);
  }

  @Get()
  @Roles(Role.ADMIN, Role.USER)
  @UseGuards(AuthGuard(), RolesGuard)
  @ApiBearerAuth()
  me(@Logged() user: User) {
    return user;
  }
}
