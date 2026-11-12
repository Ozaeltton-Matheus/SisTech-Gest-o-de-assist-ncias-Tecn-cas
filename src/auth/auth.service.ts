import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsuariosService } from 'src/usuarios/usuarios.service';
import { loginDto } from './Login.dto';
import * as bcrypt from 'bcrypt';
@Injectable()
export class AuthService {
    constructor(private readonly usuariosService: UsuariosService) {}

    async validarUsuario(loginDto: loginDto){
        // Aqui serve pra buscar o usuário no PostgreSQL pelo email
        const usuario = await this.usuariosService.buscarPorEmail(loginDto.email);

        if(!usuario){
            throw new UnauthorizedException('Email ou senha inválidos!');
        }

        const senhaValida await bcrypt.compare(loginDto.senha, usuario.senha);
        if(!senhaValida){
            throw new UnauthorizedException('Email ou senha inválidos');
        }

        const { senha, ...resultado } = usuario;
        return resultado;

    }
}
