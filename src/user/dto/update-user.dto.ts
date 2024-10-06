import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto extends PartialType(CreateUserDto) {

    @IsOptional()
    nome?: string;

    @IsOptional()
    email?: string;

    @IsOptional()
    @ApiProperty({default: '1234'})
    @IsOptional()
    @IsString()
    @IsNotEmpty()
    @Length(4, 20, {message: 'A senha deve ter entre 4 e 20 caracteres'})
    atualsenha: string;

    @ApiProperty({default: '4321'})
    @IsOptional()
    @IsString()
    @IsNotEmpty()
    @Length(4, 20, {message: 'A senha deve ter entre 4 e 20 caracteres'})
    novaSenha: string;

    @IsOptional()
    @ApiProperty({default: '4321'})
    confirmarSenha?: string;
}
