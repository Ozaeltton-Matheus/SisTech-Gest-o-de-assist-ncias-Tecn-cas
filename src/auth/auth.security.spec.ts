import { jest } from '@jest/globals';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import { PassportModule } from '@nestjs/passport';
import argon2 from 'argon2';
import request from 'supertest';
import type { App } from 'supertest/types';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { RolesGuard } from './roles.guard';
import { TipoUsuario } from './tipo-usuario.enum';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';
import { OrdensServicoController } from '../ordens-servico/ordens-servico.controller';
import { OrdensServicoService } from '../ordens-servico/ordens-servico.service';
import { CriarUsuarioAdminDto } from '../usuarios/dtos/criar-usuario-admin.dto';
import { AtualizarUsuarioDto } from '../usuarios/dtos/atualizar-usuario.dto';
import { CriarUsuarioDTO } from '../usuarios/dtos/criar-usuario.dto';
import { Usuario } from '../usuarios/entities/usuarios.entity';
import { UsuariosController } from '../usuarios/usuarios.controller';
import { UsuariosService } from '../usuarios/usuarios.service';
import { UsuarioPublico } from '../usuarios/interfaces/usuario-publico.interface';

describe('Authentication and access control', () => {
  const secret = 'unit-test-only-random-secret-with-more-than-32-characters';
  const password = 'correct-password';
  let app: INestApplication<App>;
  let passwordHash: string;
  let users: Usuario[];
  let usersService: {
    findByEmail: jest.Mock;
    verifyPassword: jest.Mock;
    toPublicUser: jest.Mock;
    findById: jest.Mock;
    findAll: jest.Mock;
    create: jest.Mock;
    createAsAdmin: jest.Mock;
    update: jest.Mock;
  };
  let ordersService: {
    listar: jest.Mock;
    consultar: jest.Mock;
  };

  const publicUser = (usuario: Usuario): UsuarioPublico => ({
    id_usuario: usuario.id!,
    email: usuario.email,
    tipo_usuario: usuario.tipo_usuario,
    ativo: usuario.ativo ?? true,
  });

  interface LoginResponse {
    access_token: string;
    user: UsuarioPublico;
  }

  async function login(email: string): Promise<string> {
    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email, senha: password })
      .expect(201);
    return (response.body as LoginResponse).access_token;
  }

  beforeAll(async () => {
    passwordHash = await argon2.hash(password);
    users = [
      {
        id: 1,
        email: 'admin@example.com',
        senha: passwordHash,
        tipo_usuario: TipoUsuario.ADMIN,
        ativo: true,
      },
      {
        id: 2,
        email: 'employee@example.com',
        senha: passwordHash,
        tipo_usuario: TipoUsuario.FUNCIONARIO,
        ativo: true,
      },
      {
        id: 3,
        email: 'client@example.com',
        senha: passwordHash,
        tipo_usuario: TipoUsuario.CLIENTE,
        ativo: true,
      },
      {
        id: 4,
        email: 'inactive@example.com',
        senha: passwordHash,
        tipo_usuario: TipoUsuario.CLIENTE,
        ativo: false,
      },
    ];

    usersService = {
      findByEmail: jest.fn(
        (email: string) =>
          users.find((usuario) => usuario.email === email) ?? null,
      ),
      verifyPassword: jest.fn((candidate: string, hash: string) =>
        argon2.verify(hash, candidate),
      ),
      toPublicUser: jest.fn((usuario: Usuario) => publicUser(usuario)),
      findById: jest.fn((id: number) => {
        const usuario = users.find((item) => item.id === id);
        return usuario ? publicUser(usuario) : null;
      }),
      findAll: jest.fn(() => users.map(publicUser)),
      create: jest.fn((dto: CriarUsuarioDTO) => ({
        id_usuario: 5,
        email: dto.email,
        tipo_usuario: TipoUsuario.CLIENTE,
        ativo: true,
      })),
      createAsAdmin: jest.fn((dto: CriarUsuarioAdminDto) => ({
        id_usuario: 6,
        email: dto.email,
        tipo_usuario: dto.tipo_usuario,
        ativo: true,
      })),
      update: jest.fn(
        (id: number, dto: AtualizarUsuarioDto): UsuarioPublico => ({
          ...publicUser(users.find((usuario) => usuario.id === id)!),
          ...dto,
        }),
      ),
    };

    ordersService = {
      listar: jest.fn(() => []),
      consultar: jest.fn((id: number) => ({ id })),
    };

    const moduleRef = await Test.createTestingModule({
      imports: [
        PassportModule.register({ defaultStrategy: 'jwt' }),
        JwtModule.register({ secret }),
      ],
      controllers: [
        AuthController,
        UsuariosController,
        OrdensServicoController,
      ],
      providers: [
        AuthService,
        LocalStrategy,
        JwtStrategy,
        JwtAuthGuard,
        LocalAuthGuard,
        RolesGuard,
        {
          provide: ConfigService,
          useValue: {
            get: (key: string) => (key === 'JWT_SECRET' ? secret : undefined),
          },
        },
        { provide: UsuariosService, useValue: usersService },
        { provide: OrdensServicoService, useValue: ordersService },
      ],
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('authenticates with Argon2 and returns only public user fields', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'admin@example.com', senha: password })
      .expect(201);
    const body = response.body as LoginResponse;

    expect(body.user).toEqual({
      id_usuario: 1,
      email: 'admin@example.com',
      tipo_usuario: TipoUsuario.ADMIN,
      ativo: true,
    });
    expect(body.user).not.toHaveProperty('senha');
    expect(body.access_token).toEqual(expect.any(String));
  });

  it.each([
    ['wrong password', 'admin@example.com', 'incorrect-password'],
    ['unknown user', 'unknown@example.com', password],
    ['inactive user', 'inactive@example.com', password],
  ])('rejects login for %s', async (_label, email, senha) => {
    await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email, senha })
      .expect(401);
  });

  it('rejects missing, invalid, and expired JWTs and serves the profile for a valid token', async () => {
    const missingResponse = await request(app.getHttpServer())
      .get('/auth/profile')
      .expect(401);

    expect(missingResponse.body).toBeDefined();
    await request(app.getHttpServer())
      .get('/auth/profile')
      .set('Authorization', 'Bearer invalid-token')
      .expect(401);

    const expiredToken = await app
      .get(JwtService)
      .signAsync({ sub: 1 }, { expiresIn: -1 });
    await request(app.getHttpServer())
      .get('/auth/profile')
      .set('Authorization', `Bearer ${expiredToken}`)
      .expect(401);

    const token = await login('client@example.com');
    await request(app.getHttpServer())
      .get('/auth/profile')
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .expect(({ body }) => {
        const user = body as UsuarioPublico;
        expect(user.email).toBe('client@example.com');
        expect(user).not.toHaveProperty('senha');
      });

    users.find((usuario) => usuario.id === 3)!.ativo = false;
    await request(app.getHttpServer())
      .get('/auth/profile')
      .set('Authorization', `Bearer ${token}`)
      .expect(401);
    users.find((usuario) => usuario.id === 3)!.ativo = true;
  });

  it('allows only ADMIN to list users and update roles', async () => {
    const adminToken = await login('admin@example.com');
    await request(app.getHttpServer())
      .get('/usuarios')
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200);
    await request(app.getHttpServer())
      .patch('/usuarios/3')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ tipo_usuario: TipoUsuario.FUNCIONARIO })
      .expect(200);

    for (const email of ['employee@example.com', 'client@example.com']) {
      const token = await login(email);
      await request(app.getHttpServer())
        .get('/usuarios')
        .set('Authorization', `Bearer ${token}`)
        .expect(403);
      await request(app.getHttpServer())
        .patch('/usuarios/3')
        .set('Authorization', `Bearer ${token}`)
        .send({ tipo_usuario: TipoUsuario.ADMIN })
        .expect(403);
    }
  });

  it('forces public registration to CLIENTE and rejects public role assignment', async () => {
    await request(app.getHttpServer())
      .post('/usuarios')
      .send({
        email: 'new-client@example.com',
        senha: password,
        tipo_usuario: TipoUsuario.ADMIN,
      })
      .expect(400);
    expect(usersService.create).not.toHaveBeenCalled();

    await request(app.getHttpServer())
      .post('/usuarios')
      .send({ email: 'new-client@example.com', senha: password })
      .expect(201)
      .expect(({ body }) => {
        const user = body as UsuarioPublico;
        expect(user.tipo_usuario).toBe(TipoUsuario.CLIENTE);
        expect(user).not.toHaveProperty('senha');
      });
  });

  it('allows ADMIN-only creation of employee or administrator accounts', async () => {
    const adminToken = await login('admin@example.com');
    await request(app.getHttpServer())
      .post('/usuarios/admin')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        email: 'new-employee@example.com',
        senha: password,
        tipo_usuario: TipoUsuario.FUNCIONARIO,
      })
      .expect(201)
      .expect(({ body }) => {
        expect((body as UsuarioPublico).tipo_usuario).toBe(
          TipoUsuario.FUNCIONARIO,
        );
      });

    const clientToken = await login('client@example.com');
    await request(app.getHttpServer())
      .post('/usuarios/admin')
      .set('Authorization', `Bearer ${clientToken}`)
      .send({
        email: 'new-admin@example.com',
        senha: password,
        tipo_usuario: TipoUsuario.ADMIN,
      })
      .expect(403);
  });

  it('allows staff to use OS routes but denies CLIENTE when ownership cannot be verified', async () => {
    const employeeToken = await login('employee@example.com');
    await request(app.getHttpServer())
      .get('/ordens-servico')
      .set('Authorization', `Bearer ${employeeToken}`)
      .expect(200);

    const clientToken = await login('client@example.com');
    await request(app.getHttpServer())
      .get('/ordens-servico')
      .set('Authorization', `Bearer ${clientToken}`)
      .expect(403);
    expect(ordersService.listar).toHaveBeenCalledTimes(1);
  });
});
