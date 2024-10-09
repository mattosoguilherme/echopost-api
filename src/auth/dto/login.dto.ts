import { ApiProperty } from "@nestjs/swagger";
import { IsEmail,Length, IsNotEmpty, IsString } from "class-validator";

export class LoginDto{

    @ApiProperty({default:"guilherme@echo.com"})
    @IsEmail()
    @IsString()
    @IsNotEmpty()
    email:string;

    @ApiProperty({default:"1234"})
    @IsString()
    @IsNotEmpty()
    @Length(4, 20, {message: 'A senha deve ter entre 4 e 20 caracteres'})

    senha:string;
}