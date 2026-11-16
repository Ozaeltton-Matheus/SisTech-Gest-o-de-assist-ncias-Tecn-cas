import { jest } from '@jest/globals';
import { ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { TipoUsuario } from './tipo-usuario.enum';
import { RolesGuard } from './roles.guard';

describe('RolesGuard', () => {
  it.each([
    [TipoUsuario.ADMIN, true],
    [TipoUsuario.FUNCIONARIO, false],
    [TipoUsuario.CLIENTE, false],
  ])('allows ADMIN-only access for role %s: %s', (role, expected) => {
    const reflector = new Reflector();
    jest
      .spyOn(reflector, 'getAllAndOverride')
      .mockReturnValue([TipoUsuario.ADMIN]);
    const guard = new RolesGuard(reflector);
    const context = {
      getHandler: jest.fn(),
      getClass: jest.fn(),
      switchToHttp: () => ({
        getRequest: () => ({
          user: {
            id_usuario: 1,
            email: 'user@example.com',
            tipo_usuario: role,
            ativo: true,
          },
        }),
      }),
    } as ExecutionContext;

    expect(guard.canActivate(context)).toBe(expected);
  });

  it('allows a route without role metadata', () => {
    const reflector = new Reflector();
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(undefined);
    const guard = new RolesGuard(reflector);
    const context = {
      getHandler: jest.fn(),
      getClass: jest.fn(),
      switchToHttp: () => ({ getRequest: () => ({}) }),
    } as ExecutionContext;

    expect(guard.canActivate(context)).toBe(true);
  });
});
