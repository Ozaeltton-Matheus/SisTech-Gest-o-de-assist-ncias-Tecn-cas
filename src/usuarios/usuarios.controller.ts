import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { TipoUsuario } from '../auth/tipo-usuario.enum';
import type { UsuarioPublico } from './interfaces/usuario-publico.interface';
import { AtualizarUsuarioDto } from './dtos/atualizar-usuario.dto';
import { CriarUsuarioAdminDto } from './dtos/criar-usuario-admin.dto';
import { CriarUsuarioDTO } from './dtos/criar-usuario.dto';
import { UsuariosService } from './usuarios.service';

interface AuthenticatedRequest {
  user: UsuarioPublico;
}

@Controller('usuarios')
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  @Post()
  createClient(@Body() dto: CriarUsuarioDTO) {
    return this.usuariosService.create(dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(TipoUsuario.ADMIN)
  @Post('admin')
  createByAdmin(@Body() dto: CriarUsuarioAdminDto) {
    return this.usuariosService.createAsAdmin(dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(TipoUsuario.ADMIN)
  @Get()
  findAll() {
    return this.usuariosService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  profile(@Req() request: AuthenticatedRequest): UsuarioPublico {
    return request.user;
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(TipoUsuario.ADMIN)
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: AtualizarUsuarioDto,
  ) {
    return this.usuariosService.update(id, dto);
  }
}
