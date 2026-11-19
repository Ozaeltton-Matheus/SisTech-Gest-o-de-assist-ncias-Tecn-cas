import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { CriarUsuarioDTO } from './dtos/criar-usuario.dto';
import { AtualizarUsuarioDTO } from './dtos/atualizar-usuario.dto';
import { UsuariosService } from './usuarios.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('usuarios')
export class UsuariosController {
  constructor(private readonly service: UsuariosService) {}

  private parseId(id: string): number {
    return Number(String(id).replace(/\D/g, ''));
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  listar() { return this.service.listar(); }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  buscar(@Param('id') id: string) { return this.service.buscarPorId(this.parseId(id)); }

  @Post()
  criarUsuario(@Body() dto: CriarUsuarioDTO) { return this.service.criarUsuario(dto); }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  atualizar(@Param('id') id: string, @Body() dto: AtualizarUsuarioDTO) { return this.service.atualizar(this.parseId(id), dto); }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remover(@Param('id') id: string) { return this.service.remover(this.parseId(id)); }
}
