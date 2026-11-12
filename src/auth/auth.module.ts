import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { UsuariosModule } from 'src/usuarios/usuarios.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LocalStrategy } from './guards/strategies/local.strategies';
import { LocalAuthGuard } from './guards/jwt-auth.guard';

@Module({
    imports: [UsuariosModule, PassportModule],
    controllers: [AuthController],
    providers: [AuthService, LocalStrategy, LocalAuthGuard]
})
export class AuthModule {}
