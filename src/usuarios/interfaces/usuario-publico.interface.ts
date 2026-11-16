import { TipoUsuario } from '../../auth/tipo-usuario.enum';

export interface UsuarioPublico {
  id_usuario: number;
  email: string;
  tipo_usuario: TipoUsuario;
  ativo: boolean;
}
