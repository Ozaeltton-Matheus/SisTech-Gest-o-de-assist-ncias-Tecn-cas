
import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Patch,
  Query,
} from '@nestjs/common';

import { OrdensServicoService } from './ordens-servico.service';
import { CriarOrdemServicoDto } from './dto/criar-ordem-servico.dto';
import { RegistrarDiagnosticoDto } from './dto/registrar-diagnostico.dto';
import { GerarOrcamentoDto } from './dto/gerar-orcamento.dto';
import { StatusOS } from './entities/status-os.enum';

@Controller('ordens-servico')
export class OrdensServicoController {
  constructor(
    private readonly service: OrdensServicoService,
  ) {}

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
  acao(
    @Param('id', ParseIntPipe) id: number,
    @Body('descricao') descricao: string,
  ) {
    return this.service.registrarAcao(id, descricao);
  }

  @Patch(':id/status')
  status(
    @Param('id', ParseIntPipe) id: number,
    @Body('status') status: StatusOS,
  ) {
    return this.service.atualizarStatus(id, status);
  }

  @Post(':id/finalizar')
  finalizar(@Param('id', ParseIntPipe) id: number) {
    return this.service.finalizar(id);
  }
}
