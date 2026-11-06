import {IsEmail, IsIn, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

export class CriarUsuarioDTO {

    @IsString()
    @IsNotEmpty({message: 'O campo nome não pode ser vazio'})
    nome!: string;

    @IsEmail({}, {message: 'Informe um emai válido'})
    @IsNotEmpty({message: 'O email é obrigatório'})
    email!:string;

    @IsString()
    @IsNotEmpty({message: 'A senha é obrigatória'})
    @MinLength(6, {message: 'A senha deve ter no mínimo 6 caractéres'})
    senha!: string;

    @IsString()
    @IsNotEmpty()
    cpf!: string;

    @IsString()
    @IsNotEmpty()
    endereco!: string;

    @IsString()
    @IsNotEmpty()
    telefone!: string;

    @IsString()
    @IsOptional()
    cargo?: string;

    @IsString()
    @IsIn(['Cliente', 'Funcionario'])
    @IsNotEmpty({message: 'O tipo do usuário é obrigatório' })
    tipo_usuario!: string;

}