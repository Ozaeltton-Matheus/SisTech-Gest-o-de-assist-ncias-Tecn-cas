import { Module } from '@nestjs/common';
import { OrdemServicoService } from './ordem_servico.service';
import { OrdemServicoController } from './ordem_servico.controller';

@Module({
  providers: [OrdemServicoService],
  controllers: [OrdemServicoController]
})
export class OrdemServicoModule {}
