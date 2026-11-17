import {Module} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Usuario } from './entities/usuarios.entity';
import { UsuariosController } from './usuarios.controller';
import { UsuariosService } from './usuarios.service';
import { Cliente } from './entities/cliente.entity';
import { Funcionario } from './entities/funcionario.entity';


@Module({
    imports: [TypeOrmModule.forFeature([Usuario, Cliente, Funcionario])],
    controllers: [UsuariosController],
    providers: [UsuariosService],
    exports: [UsuariosService]
})
export class UsuariosModule{}