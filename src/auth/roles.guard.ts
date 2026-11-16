import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { TipoUsuario } from './tipo-usuario.enum';
import { ROLES_KEY } from './roles.decorator';
import { UsuarioPublico } from '../usuarios/interfaces/usuario-publico.interface';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.getAllAndOverride<TipoUsuario[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!roles?.length) {
      return true;
    }

    const request = context.switchToHttp().getRequest<{
      user?: UsuarioPublico;
    }>();
    return !!request.user && roles.includes(request.user.tipo_usuario);
  }
}
