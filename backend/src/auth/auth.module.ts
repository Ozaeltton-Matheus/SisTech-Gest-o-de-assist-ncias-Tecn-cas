import { JwtStrategy } from './guards/strategies/jwt.strategy';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UsuariosModule } from 'src/usuarios/usuarios.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LocalStrategy } from './guards/strategies/local.strategies';
import { LocalAuthGuard } from './guards/jwt-auth.guard';

@Module({
    imports: [
        UsuariosModule,
        PassportModule,
        JwtModule.register({
            secret: process.env.JWT_SECRET || 'chave-sistecnica',
            signOptions: { expiresIn: '1d' },
        })
    ],
    controllers: [AuthController],
    providers: [AuthService, LocalStrategy, LocalAuthGuard, JwtStrategy],
})
export class AuthModule {}
