import { IsBoolean, IsEmail, IsOptional, IsString } from 'class-validator';

export class AtualizarUsuarioDTO {
  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  senha?: string;

  @IsOptional()
  @IsString()
  tipo_usuario?: string;

  @IsOptional()
  @IsBoolean()
  ativo?: boolean;

  @IsOptional()
  @IsString()
  nome?: string;

  @IsOptional()
  @IsString()
  cpf?: string;

  @IsOptional()
  @IsString()
  telefone?: string;

  @IsOptional()
  @IsString()
  endereco?: string;

  @IsOptional()
  @IsString()
  cargo?: string;
}
