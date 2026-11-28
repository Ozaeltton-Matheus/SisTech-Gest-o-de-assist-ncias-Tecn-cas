import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import request from 'supertest';
import { App } from 'supertest/types';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Cliente } from './entities/cliente.entity';
import { Funcionario } from './entities/funcionario.entity';
import { Usuario } from './entities/usuarios.entity';
import { UsuariosController } from './usuarios.controller';
import { UsuariosService } from './usuarios.service';

jest.mock('@nestjs/typeorm', () => {
  const { Inject } =
    jest.requireActual<typeof import('@nestjs/common')>('@nestjs/common');
  return {
    InjectRepository: (entity: { name: string }) =>
      Inject(`${entity.name}Repository`),
    getRepositoryToken: (entity: { name: string }) =>
      `${entity.name}Repository`,
  };
});
jest.mock('../auth/guards/jwt-auth.guard', () => ({
  JwtAuthGuard: class JwtAuthGuard {},
}));

describe('UsuariosController (e2e)', () => {
  let app: INestApplication<App>;

  const managerMock = {
    save: jest.fn((entity: object) => ({
      ...entity,
      id: 2,
      ativo: true,
    })),
  };
  const usuarioRepository = {
    find: jest.fn().mockResolvedValue([
      {
        id: 1,
        email: 'cliente@example.com',
        senha: '$2b$10$secret-hash',
        tipo_usuario: 'Cliente',
        ativo: true,
        clientes: [{ nome: 'Cliente' }],
      },
    ]),
    create: jest.fn((usuario: Partial<Usuario>) => usuario),
    manager: {
      transaction: jest.fn(
        (callback: (manager: typeof managerMock) => Promise<unknown>) =>
          callback(managerMock),
      ),
    },
  };
  const clienteRepository = {
    create: jest.fn((cliente: Partial<Cliente>) => cliente),
  };
  const funcionarioRepository = {
    create: jest.fn((funcionario: Partial<Funcionario>) => funcionario),
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [UsuariosController],
      providers: [
        UsuariosService,
        { provide: getRepositoryToken(Usuario), useValue: usuarioRepository },
        { provide: getRepositoryToken(Cliente), useValue: clienteRepository },
        {
          provide: getRepositoryToken(Funcionario),
          useValue: funcionarioRepository,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('GET /usuarios returns only approved user properties', async () => {
    const response = await request(app.getHttpServer())
      .get('/usuarios')
      .expect(200);

    expect(response.body).toEqual([
      {
        id: 1,
        email: 'cliente@example.com',
        tipo_usuario: 'Cliente',
        ativo: true,
      },
    ]);
  });

  it('POST /usuarios returns only approved user properties', async () => {
    const response = await request(app.getHttpServer())
      .post('/usuarios')
      .send({
        nome: 'Novo Cliente',
        email: 'novo@example.com',
        senha: 'senha-segura',
        cpf: '12345678900',
        endereco: 'Rua Exemplo',
        telefone: '11999999999',
        tipo_usuario: 'Cliente',
      })
      .expect(201);

    expect(response.body).toEqual({
      id: 2,
      email: 'novo@example.com',
      tipo_usuario: 'Cliente',
      ativo: true,
    });
  });
});
