import { Usuario } from '../entities/usuarios.entity';

export class UsuarioRespostaDTO {
  id?: number;
  email!: string;
  tipo_usuario!: string;
  ativo?: boolean;

  static fromEntity(usuario: Usuario): UsuarioRespostaDTO {
    return {
      id: usuario.id,
      email: usuario.email,
      tipo_usuario: usuario.tipo_usuario,
      ativo: usuario.ativo,
    };
  }
}
