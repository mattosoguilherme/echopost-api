import { PartialType } from '@nestjs/swagger';
import { LoginDto } from './login.dto';
import { User } from '@prisma/client';
import { IsNotEmpty, IsString } from 'class-validator';

export class ResponseDto extends PartialType(LoginDto) {
    @IsString()
    @IsNotEmpty()
    token: string;

    @IsNotEmpty()
    user:User
}
