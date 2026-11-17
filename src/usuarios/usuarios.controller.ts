import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { CriarUsuarioDTO } from './dtos/criar-usuario.dto';
import { UsuariosService } from './usuarios.service';
import { LocalAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('usuarios')
export class UsuariosController {
    constructor ( private readonly service: UsuariosService, ) {}

    @UseGuards(LocalAuthGuard)
    @Get()
    listar() {
        return this.service.listar()
    }

    @Post()
    async criarUsuario(@Body() criarUsuarioDTO: CriarUsuarioDTO) {
        return this.service.criarUsuario(criarUsuarioDTO);
    }

    
    
}

