import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import * as argon2 from 'argon2';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from './entities/usuarios.entity';
<<<<<<< Updated upstream
import { CriarUsuarioDTO } from './dtos/criar-usuario.dto';
import { CriarUsuarioAdminDto } from './dtos/criar-usuario-admin.dto';
import { AtualizarUsuarioDto } from './dtos/atualizar-usuario.dto';
import { UsuarioPublico } from './interfaces/usuario-publico.interface';
import { TipoUsuario } from '../auth/tipo-usuario.enum';

=======
import { Cliente } from './entities/cliente.entity';
import { Funcionario } from './entities/funcionario.entity';
import { UsuarioRespostaDTO } from './dtos/usuario-resposta.dto';
>>>>>>> Stashed changes
@Injectable()
export class UsuariosService {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
  ) {}

  async hashPassword(password: string): Promise<string> {
    return argon2.hash(password);
  }

  async verifyPassword(password: string, hash: string): Promise<boolean> {
    return argon2.verify(hash, password);
  }

<<<<<<< Updated upstream
  async create(dto: CriarUsuarioDTO): Promise<UsuarioPublico> {
    return this.createWithRole(dto, TipoUsuario.CLIENTE);
  }

  async createAsAdmin(dto: CriarUsuarioAdminDto): Promise<UsuarioPublico> {
    return this.createWithRole(dto, dto.tipo_usuario);
  }

  private async createWithRole(
    dto: CriarUsuarioDTO,
    tipo_usuario: TipoUsuario,
  ): Promise<UsuarioPublico> {
    const senhaHash = await this.hashPassword(dto.senha);

    const usuario = this.usuarioRepository.create({
      email: dto.email,
      senha: senhaHash,
      tipo_usuario,
    });

    const usuarioSalvo = await this.usuarioRepository.save(usuario);

    return this.toPublicUser(usuarioSalvo);
  }

  async findByEmail(email: string): Promise<Usuario | null> {
    return this.usuarioRepository
      .createQueryBuilder('usuario')
      .addSelect('usuario.senha')
      .where('usuario.email = :email', { email })
      .getOne();
  }

  async findById(id: number): Promise<UsuarioPublico | null> {
    const usuario = await this.usuarioRepository.findOneBy({ id });
    return usuario ? this.toPublicUser(usuario) : null;
  }

  async findAll(): Promise<UsuarioPublico[]> {
    const usuarios = await this.usuarioRepository.find();
    return usuarios.map((usuario) => this.toPublicUser(usuario));
  }

  async update(id: number, dto: AtualizarUsuarioDto): Promise<UsuarioPublico> {
    const usuario = await this.usuarioRepository.findOneBy({ id });
    if (!usuario) {
      throw new NotFoundException('Usuário não encontrado');
    }

    if (dto.email !== undefined) usuario.email = dto.email;
    if (dto.tipo_usuario !== undefined) {
      usuario.tipo_usuario = dto.tipo_usuario;
    }
    if (dto.ativo !== undefined) usuario.ativo = dto.ativo;

    return this.toPublicUser(await this.usuarioRepository.save(usuario));
  }

  toPublicUser(usuario: Usuario): UsuarioPublico {
    if (usuario.id === undefined) {
      throw new InternalServerErrorException(
        'Usuário persistido sem identificador',
      );
=======
    async listar(): Promise<UsuarioRespostaDTO[]> {
        const usuarios = await this.repository.find({ order: { id: 'ASC' } });
        return usuarios.map(usuario => UsuarioRespostaDTO.fromEntity(usuario));
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

    async criarUsuario(dto: CriarUsuarioDTO): Promise<UsuarioRespostaDTO> {
        const senhaCriptografada = await bcrypt.hash(dto.senha, 10)

        const usuarioSalvo = await this.repository.manager.transaction(async (manager) => {
            const usuario = this.repository.create({
                email: dto.email,
                senha: senhaCriptografada,
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

        return UsuarioRespostaDTO.fromEntity(usuarioSalvo);
>>>>>>> Stashed changes
    }

    return {
      id_usuario: usuario.id,
      email: usuario.email,
      tipo_usuario: usuario.tipo_usuario,
      ativo: usuario.ativo ?? true,
    };
  }
}
