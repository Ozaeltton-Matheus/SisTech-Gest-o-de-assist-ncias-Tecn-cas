import { jest } from '@jest/globals';
import { Test, TestingModule } from '@nestjs/testing';
import { ValidationPipe } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TipoUsuario } from '../auth/tipo-usuario.enum';
import { Usuario } from './entities/usuarios.entity';
import { UsuariosService } from './usuarios.service';
import { CriarUsuarioDTO } from './dtos/criar-usuario.dto';

describe('UsuariosService', () => {
  let service: UsuariosService;
  let repository: {
    create: jest.Mock;
    save: jest.Mock;
  };

  beforeEach(async () => {
    repository = {
      create: jest.fn((usuario: Record<string, unknown>) => usuario),
      save: jest.fn((usuario: Record<string, unknown>) => ({
        ...usuario,
        id: 1,
        ativo: true,
      })),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsuariosService,
        {
          provide: getRepositoryToken(Usuario),
          useValue: repository,
        },
      ],
    }).compile();

    service = module.get<UsuariosService>(UsuariosService);
    jest.spyOn(service, 'hashPassword').mockResolvedValue('argon2-hash');
  });

  it('forces public registrations to CLIENTE and omits the password in the response', async () => {
    const dto: CriarUsuarioDTO = {
      email: 'cliente@example.com',
      senha: 'senha-segura',
    };

    await expect(service.create(dto)).resolves.toEqual({
      id_usuario: 1,
      email: dto.email,
      tipo_usuario: TipoUsuario.CLIENTE,
      ativo: true,
    });
    expect(repository.create).toHaveBeenCalledWith({
      email: dto.email,
      senha: 'argon2-hash',
      tipo_usuario: TipoUsuario.CLIENTE,
    });
  });

  it('does not accept role assignment on the public registration DTO', async () => {
    const pipe = new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    });

    await expect(
      pipe.transform(
        {
          email: 'attacker@example.com',
          senha: 'senha-segura',
          tipo_usuario: TipoUsuario.ADMIN,
        },
        { type: 'body', metatype: CriarUsuarioDTO, data: '' },
      ),
    ).rejects.toThrow();
    expect(repository.save).not.toHaveBeenCalled();
  });
});
