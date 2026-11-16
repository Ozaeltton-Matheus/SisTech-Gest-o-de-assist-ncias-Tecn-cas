import { IsBoolean, IsEmail, IsEnum, IsOptional } from 'class-validator';
import { TipoUsuario } from '../../auth/tipo-usuario.enum';

export class AtualizarUsuarioDto {
  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsEnum(TipoUsuario)
  tipo_usuario?: TipoUsuario;

  @IsOptional()
  @IsBoolean()
  ativo?: boolean;
}
