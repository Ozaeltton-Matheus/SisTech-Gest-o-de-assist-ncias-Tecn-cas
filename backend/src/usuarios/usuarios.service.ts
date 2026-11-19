import * as bcrypt from 'bcrypt';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CriarUsuarioDTO } from './dtos/criar-usuario.dto';
import { AtualizarUsuarioDTO } from './dtos/atualizar-usuario.dto';
import { Usuario } from './entities/usuarios.entity';
import { Cliente } from './entities/cliente.entity';
import { Funcionario } from './entities/funcionario.entity';

@Injectable()
export class UsuariosService {
  constructor(
    @InjectRepository(Usuario) private readonly repository: Repository<Usuario>,
    @InjectRepository(Cliente) private readonly clienteRepository: Repository<Cliente>,
    @InjectRepository(Funcionario) private readonly funcionarioRepository: Repository<Funcionario>,
  ) {}

  listar() {
    return this.repository.find({ relations: ['clientes', 'funcionarios'], order: { id: 'ASC' } });
  }

  async buscarPorId(id: number) {
    const usuario = await this.repository.findOne({ where: { id }, relations: ['clientes', 'funcionarios'] });
    if (!usuario) throw new NotFoundException('Usuario não encontrado');
    return usuario;
  }

  buscarPorEmail(email: string) {
    return this.repository.findOneBy({ email });
  }

  async criarUsuario(dto: CriarUsuarioDTO) {
    const senhaCriptografada = await bcrypt.hash(dto.senha, 10);
    return this.repository.manager.transaction(async (manager) => {
      const usuario = this.repository.create({ email: dto.email, senha: senhaCriptografada, tipo_usuario: dto.tipo_usuario });
      const usuarioSalvo = await manager.save(usuario);
      if (dto.tipo_usuario === 'Cliente') {
        await manager.save(this.clienteRepository.create({ nome: dto.nome, cpf: dto.cpf, telefone: dto.telefone, endereco: dto.endereco, usuario: usuarioSalvo }));
      } else if (dto.tipo_usuario === 'Funcionario') {
        await manager.save(this.funcionarioRepository.create({ nome: dto.nome, cpf: dto.cpf, telefone: dto.telefone, cargo: dto.cargo, usuario: usuarioSalvo }));
      }
      return usuarioSalvo;
    });
  }

  async atualizar(id: number, dto: AtualizarUsuarioDTO) {
    const usuario = await this.buscarPorId(id);
    return this.repository.manager.transaction(async (manager) => {
      if (dto.email !== undefined) usuario.email = dto.email;
      if (dto.tipo_usuario !== undefined) usuario.tipo_usuario = dto.tipo_usuario;
      if (dto.ativo !== undefined) usuario.ativo = dto.ativo;
      if (dto.senha?.trim()) usuario.senha = await bcrypt.hash(dto.senha, 10);
      await manager.save(usuario);

      if (usuario.clientes?.[0]) {
        const c = usuario.clientes[0];
        if (dto.nome !== undefined) c.nome = dto.nome;
        if (dto.cpf !== undefined) c.cpf = dto.cpf;
        if (dto.telefone !== undefined) c.telefone = dto.telefone;
        if (dto.endereco !== undefined) c.endereco = dto.endereco;
        await manager.save(c);
      }
      if (usuario.funcionarios?.[0]) {
        const f = usuario.funcionarios[0];
        if (dto.nome !== undefined) f.nome = dto.nome;
        if (dto.cpf !== undefined) f.cpf = dto.cpf;
        if (dto.telefone !== undefined) f.telefone = dto.telefone;
        if (dto.cargo !== undefined) f.cargo = dto.cargo;
        await manager.save(f);
      }
      return this.buscarPorId(id);
    });
  }

  async remover(id: number) {
    await this.buscarPorId(id);
    return this.repository.manager.transaction(async (manager) => {
      await manager.delete(Cliente, { usuario: { id } });
      await manager.delete(Funcionario, { usuario: { id } });
      await manager.delete(Usuario, { id });
      return { deleted: true, id };
    });
  }
}
