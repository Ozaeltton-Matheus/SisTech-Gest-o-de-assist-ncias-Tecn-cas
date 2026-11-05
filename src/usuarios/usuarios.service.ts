import { IsEmail } from 'class-validator';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CriarUsuarioDTO } from './dtos/criar-usuario.dto';
import { Usuario } from './entities/usuarios.entity';
@Injectable()
export class UsuariosService {
    constructor(
        @InjectRepository(Usuario)
        private readonly repository: Repository<Usuario>,
    ) {}

    listar() {
        return this.repository.find({ order: { id: 'ASC' }});
    }

    async buscarPorId(id: number) {
        const usuario = await this.repository.findOneBy({ id });
        if (!usuario) {
            throw new NotFoundException('Usuario não encontrado');
        }
        return usuario;
    }

    buscarPorEmail(email: string) {
        return this.repository.findOneBy({email});
    }

    criarUsuario(dto: CriarUsuarioDTO) {
        const usuario = this.repository.create({
            nome: dto.nome,
            email: dto.email,
            senha: dto.senha,
            tipo_usuario: dto.tipo_usuario
        })
        return this.repository.save(usuario);
    }
}
