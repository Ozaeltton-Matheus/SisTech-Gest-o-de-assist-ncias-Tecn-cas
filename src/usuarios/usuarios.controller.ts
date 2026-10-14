import { Body, Controller, Post } from '@nestjs/common';
import { CriarUsuarioDTO } from './dtos/criar-usuario.dto';
import { UsuariosService } from './usuarios.service';

@Controller('usuarios')
export class UsuariosController {
    @Post()
    async criarUsuario(@Body() criarUsuarioDTO: CriarUsuarioDTO) {
        return criarUsuarioDTO;
    }
    
}


