import {IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CriarUsuarioDTO {
    nome: string;
    email: string;
    senha: string;
    tipo_usuario: string;

}