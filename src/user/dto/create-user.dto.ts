import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString, Length } from "class-validator";

export class CreateUserDto {

    @ApiProperty({default: 'João da Silva'})
    @IsString()
    @IsNotEmpty()
    nome: string;

    @ApiProperty({default: 'joa@gmail.com'})
    @IsString()
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @ApiProperty({default: '1234'})
    @IsString()
    @IsNotEmpty()
    @Length(4, 20, {message: 'A senha deve ter entre 4 e 20 caracteres'})
    senha: string;

    @ApiProperty({default: '1234'})
    @IsString()
    @IsNotEmpty()
    @Length(4, 20, {message: 'A senha deve ter entre 4 e 20 caracteres'})
    confirmarSenha: string;
}
