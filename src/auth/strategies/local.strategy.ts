import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';
import { AuthService } from '../auth.service';
import { LoginDto } from '../dto/login.dto';
import { UsuarioPublico } from '../../usuarios/interfaces/usuario-publico.interface';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({ usernameField: 'email', passwordField: 'senha' });
  }

  validate(email: string, senha: string): Promise<UsuarioPublico> {
    const credentials = plainToInstance(LoginDto, { email, senha });
    if (validateSync(credentials).length > 0) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    return this.authService.validateUser(email, senha);
  }
}
