import { IsEnum } from 'class-validator';
import { TipoUsuario } from '../../auth/tipo-usuario.enum';
import { CriarUsuarioDTO } from './criar-usuario.dto';

export class CriarUsuarioAdminDto extends CriarUsuarioDTO {
  @IsEnum(TipoUsuario)
  tipo_usuario: TipoUsuario;
}
