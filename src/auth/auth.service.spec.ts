import { jest } from '@jest/globals';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsuariosService } from '../usuarios/usuarios.service';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import { TipoUsuario } from './tipo-usuario.enum';

describe('AuthService', () => {
  let service: AuthService;
  let usuariosService: {
    findByEmail: jest.Mock;
    verifyPassword: jest.Mock;
    toPublicUser: jest.Mock;
  };
  let jwtService: { signAsync: jest.Mock };

  beforeEach(async () => {
    usuariosService = {
      findByEmail: jest.fn(),
      verifyPassword: jest.fn(),
      toPublicUser: jest.fn(),
    };
    jwtService = { signAsync: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsuariosService, useValue: usuariosService },
        { provide: JwtService, useValue: jwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('rejects unknown, inactive, or invalid-password users', async () => {
    usuariosService.findByEmail.mockResolvedValueOnce(null);
    await expect(
      service.validateUser('unknown@example.com', 'secret'),
    ).rejects.toBeInstanceOf(UnauthorizedException);
    expect(usuariosService.verifyPassword).not.toHaveBeenCalled();

    usuariosService.findByEmail.mockResolvedValueOnce({
      ativo: false,
      senha: 'hash',
    });
    await expect(
      service.validateUser('inactive@example.com', 'secret'),
    ).rejects.toBeInstanceOf(UnauthorizedException);

    usuariosService.findByEmail.mockResolvedValueOnce({
      ativo: true,
      senha: 'hash',
    });
    usuariosService.verifyPassword.mockResolvedValueOnce(false);
    await expect(
      service.validateUser('user@example.com', 'wrong'),
    ).rejects.toBeInstanceOf(UnauthorizedException);
  });

  it('returns a public user after valid credentials and signs an access token', async () => {
    const user = {
      id_usuario: 1,
      email: 'admin@example.com',
      tipo_usuario: TipoUsuario.ADMIN,
      ativo: true,
    };
    usuariosService.findByEmail.mockResolvedValue({
      id: 1,
      email: user.email,
      tipo_usuario: user.tipo_usuario,
      ativo: true,
      senha: 'hash',
    });
    usuariosService.verifyPassword.mockResolvedValue(true);
    usuariosService.toPublicUser.mockReturnValue(user);
    jwtService.signAsync.mockResolvedValue('signed-token');

    await expect(service.validateUser(user.email, 'correct')).resolves.toEqual(
      user,
    );
    await expect(service.login(user)).resolves.toEqual({
      access_token: 'signed-token',
      user,
    });
    expect(jwtService.signAsync).toHaveBeenCalledWith({
      sub: user.id_usuario,
      email: user.email,
    });
  });
});
