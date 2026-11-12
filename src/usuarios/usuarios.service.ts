import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CriarUsuarioDTO } from './dtos/criar-usuario.dto';
import { Usuario } from './entities/usuarios.entity';
import { Cliente } from './entities/cliente.entity';
import { Funcionario } from './entities/funcionario.entity';
@Injectable()
export class UsuariosService {
    constructor(
        @InjectRepository(Usuario)
        private readonly repository: Repository<Usuario>,

        @InjectRepository(Cliente)
        private readonly clienteRepository: Repository<Cliente>,

        @InjectRepository(Funcionario)
        private readonly funcionarioRepository: Repository<Funcionario>
    ) { }

    listar() {
        return this.repository.find({ order: { id: 'ASC' } });
    }

    async buscarPorId(id: number) {
        const usuario = await this.repository.findOneBy({ id });
        if (!usuario) {
            throw new NotFoundException('Usuario não encontrado');
        }
        return usuario;
    }

    buscarPorEmail(email: string) {
        return this.repository.findOneBy({ email });
    }

    criarUsuario(dto: CriarUsuarioDTO) {
        return this.repository.manager.transaction(async (manager) => {
            const usuario = this.repository.create({
                email: dto.email,
                senha: dto.senha,
                tipo_usuario: dto.tipo_usuario
            });

            const usuarioSalvo = await manager.save(usuario)

            if (dto.tipo_usuario === "Cliente") {
                const cliente = this.clienteRepository.create({
                    nome: dto.nome,
                    cpf: dto.cpf,
                    telefone: dto.telefone,
                    endereco: dto.endereco,
                    usuario: usuarioSalvo
                });
                await manager.save(cliente);
            }

            else if (dto.tipo_usuario === 'Funcionario') {
                const funcionario = this.funcionarioRepository.create({
                    nome: dto.nome,
                    cpf: dto.cpf,
                    telefone: dto.telefone,
                    cargo: dto.cargo,
                    usuario: usuarioSalvo
                });
                await manager.save(funcionario);
            }
            
            return usuarioSalvo;
        });

    }

}
