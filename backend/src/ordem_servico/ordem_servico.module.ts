import { Module } from '@nestjs/common';
import { OrdemServicoService } from './ordem_servico.service';
import { OrdemServicoController } from './ordem_servico.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AcaoReparo } from './entities/acao_reparo.entity';
import { Agendamento } from './entities/agendamento.entity';
import { Diagnostico } from './entities/diagnostico.entity';
import { HistoricoStatusOS } from './entities/historico_status_os.entity';
import { Orcamento } from './entities/orcamento.entity';
import { OrdemServico } from './entities/ordem_servico.entity';
import { OS_Servico } from './entities/os_servico.entity';
import { Pagamento } from './entities/pagamento.entity';
import { Servico } from './entities/servico.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AcaoReparo, Agendamento, Diagnostico, HistoricoStatusOS, Orcamento, OrdemServico, OS_Servico, Pagamento, Servico])],
  providers: [OrdemServicoService],
  controllers: [OrdemServicoController]
})
export class OrdemServicoModule {}
