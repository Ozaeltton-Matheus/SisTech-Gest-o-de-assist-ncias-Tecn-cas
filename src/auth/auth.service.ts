import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsuariosService } from '../usuarios/usuarios.service';
import { UsuarioPublico } from '../usuarios/interfaces/usuario-publico.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly usuariosService: UsuariosService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, senha: string): Promise<UsuarioPublico> {
    const usuario = await this.usuariosService.findByEmail(email);

    if (!usuario || !usuario.ativo) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const senhaValida = await this.usuariosService.verifyPassword(
      senha,
      usuario.senha,
    );

    if (!senhaValida) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    return this.usuariosService.toPublicUser(usuario);
  }

  async login(user: UsuarioPublico) {
    const access_token = await this.jwtService.signAsync({
      sub: user.id_usuario,
      email: user.email,
    });

    return { access_token, user };
  }
}
