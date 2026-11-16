import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';

import { OrdensServicoService } from './ordens-servico.service';
import { CriarOrdemServicoDto } from './dto/criar-ordem-servico.dto';
import { RegistrarDiagnosticoDto } from './dto/registrar-diagnostico.dto';
import { GerarOrcamentoDto } from './dto/gerar-orcamento.dto';
import { AtualizarStatusDto } from './dto/atualizar-status.dto';
import { RegistrarAcaoDto } from './dto/registrar-acao.dto';
import { StatusOS } from './entities/status-os.enum';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { TipoUsuario } from '../auth/tipo-usuario.enum';

@Controller('ordens-servico')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(TipoUsuario.ADMIN, TipoUsuario.FUNCIONARIO)
export class OrdensServicoController {
  constructor(private readonly service: OrdensServicoService) {}

  @Post()
  criar(@Body() dto: CriarOrdemServicoDto) {
    return this.service.criar(dto);
  }

  @Get()
  listar(@Query('status') status?: StatusOS) {
    return this.service.listar(status);
  }

  @Get(':id')
  consultar(@Param('id', ParseIntPipe) id: number) {
    return this.service.consultar(id);
  }

  @Patch(':id/diagnostico')
  diagnostico(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: RegistrarDiagnosticoDto,
  ) {
    return this.service.registrarDiagnostico(id, dto);
  }

  @Post(':id/orcamento')
  orcamento(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: GerarOrcamentoDto,
  ) {
    return this.service.gerarOrcamento(id, dto);
  }

  @Post(':id/acoes-reparo')
  acao(@Param('id', ParseIntPipe) id: number, @Body() dto: RegistrarAcaoDto) {
    return this.service.registrarAcao(id, dto.descricao);
  }

  @Patch(':id/status')
  status(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: AtualizarStatusDto,
  ) {
    return this.service.atualizarStatus(id, dto.status);
  }

  @Post(':id/finalizar')
  finalizar(@Param('id', ParseIntPipe) id: number) {
    return this.service.finalizar(id);
  }
}
