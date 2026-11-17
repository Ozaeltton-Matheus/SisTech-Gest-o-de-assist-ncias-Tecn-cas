import { UsuariosService } from './../usuarios/usuarios.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Injectable } from '@nestjs/common';
import { Any } from 'typeorm';
import { access } from 'fs';

@Injectable()
export class AuthService {
    constructor(
        private readonly usuariosService: UsuariosService,
        private readonly jwtService: JwtService,
    ) {}

    async validarUsuario(email: string, senha: string,) {
        const usuario = await this.usuariosService.buscarPorEmail(email);

        if (!usuario || !usuario.ativo) {
            return null;
        }

        const SenhaValida = await bcrypt.compare(senha, usuario.senha);
        if(!SenhaValida){
            return null;
        }

        const { senha: _senha, ...principal } = usuario;
        return principal;
        
        }
        async login(usuario: any){
            const payload = {
                sub: usuario?.id,
                email: usuario?.email,
                tipo_usuario: usuario?.tipo_usuario,
            };
            return{
                access_token: this.jwtService.sign(payload),
            }
        }
    }

