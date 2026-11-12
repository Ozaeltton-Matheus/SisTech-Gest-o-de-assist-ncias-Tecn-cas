import { UsuariosService } from './../usuarios/usuarios.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
    constructor(private readonly usuariosService: UsuariosService) {}

    async validarUsuario(email: string, senha: string,) {
        const usuario = await this.usuariosService.buscarPorEmail(email);

        if (!usuario || !usuario.ativo || usuario.senha !== senha) {
            return null;
        }

        const { senha: _senha, ...principal } = usuario;
        return principal;
    }
}
