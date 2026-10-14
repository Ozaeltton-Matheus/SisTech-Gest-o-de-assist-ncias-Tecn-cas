import {
    Injectable,
    NotFoundException,
    BadRequestException,
} from '@nestjs/common';

import { OrdemServico } from "./entities/ordem-servico.entity";
import { CriarOrdemServicoDto } from "./dto/criar-ordem-servico.dto";
import { RegistrarDiagnosticoDto } from "./dto/registrar-diagnostico.dto";
import { GerarOrcamentoDto } from "./dto/gerar-orcamento.dto";
import { StatusOS } from "./entities/status-os.enum";

@Injectable()
export class OrdensServicoService {
    private ordensServico: OrdemServico[] = [];
    private proximoId: number = 1;

    private buscarPorId(id: number): OrdemServico {
        const ordemServico = this.ordensServico.find(ordem => ordem.id === id);
        if (!ordemServico) {
            throw new NotFoundException(`Ordem de serviço com ID ${id} não encontrada.`);
        }
        return ordemServico;
    }

    // criar ordem de serviço 
    criar(dto: CriarOrdemServicoDto): OrdemServico {
        const agora = new Date();

        const ordem: OrdemServico = {
            id: this.proximoId++,
            cliente: dto.cliente,
            equipamento: dto.equipamento,
            defeitoRelatado: dto.defeitoRelatado,
            acoesReparo: [],
            criadaEm: agora,
            atualizadaEm: agora,
            status: StatusOS.RECEBIDO,
        };
        this.ordensServico.push(ordem);
        return ordem;
    }

    // vizualizar a fila de concertos

    listar(status?: StatusOS): OrdemServico[] {
        if (status && !Object.values(StatusOS).includes(status)) {
            throw new BadRequestException('Status inválido');
        }
        return this.ordensServico.filter(ordem => !status || ordem.status === status);
    }

    // consultar uma ordem de serviço específica
    consultar(id: number): OrdemServico {
        return this.buscarPorId(id);
    }

    // registrar diagnostico
    registrarDiagnostico(id: number, dto: RegistrarDiagnosticoDto): OrdemServico {
        const ordem = this.buscarPorId(id);
        if (ordem.status !== StatusOS.RECEBIDO && ordem.status !== StatusOS.EM_ANALISE) {
            throw new BadRequestException('O diagnóstico só pode ser registrado durante a análise');
        }
        ordem.diagnostico = dto.diagnostico;
        ordem.status = StatusOS.EM_ANALISE;
        ordem.atualizadaEm = new Date();
        return ordem;
    }

    // gerar orçamento
    gerarOrcamento(id: number, dto: GerarOrcamentoDto) {
        const ordem = this.buscarPorId(id);
        if (!ordem.diagnostico) {
            throw new BadRequestException('O orçamento só pode ser gerado após o diagnóstico');
        };

        const desconto = dto.valorDesconto ?? 0;
        const subtotal = dto.valorMaoDeObra + dto.valorPecas;

        if (desconto > subtotal) {
            throw new BadRequestException('O valor do desconto não pode ser maior que o subtotal');
        };
        ordem.valorMaoDeObra = dto.valorMaoDeObra;
        ordem.valorPecas = dto.valorPecas;
        ordem.atualizadaEm = new Date();

        return {
            ordem,
            subtotal,
            desconto,
            total: subtotal - desconto
        };

    }
    // rgistrar ações de reparo
    registrarAcao(id: number, descricao: string): OrdemServico {
        const ordem = this.buscarPorId(id);

        if (
            ordem.status !== StatusOS.EM_REPARO &&
            ordem.status !== StatusOS.AGUARDANDO_PECA
        ) {
            throw new BadRequestException(
                'Ações de reparo exigem uma OS em reparo ou aguardando peça',
            );
        }

        ordem.acoesReparo.push(descricao);
        ordem.atualizadaEm = new Date();

        return ordem;

    }
    // Atualizar status
    atualizarStatus(
        id: number,
        novoStatus: StatusOS,
    ): OrdemServico {
        const ordem = this.buscarPorId(id);

        const transicoes: Record<StatusOS, StatusOS[]> = {
            [StatusOS.RECEBIDO]: [StatusOS.EM_ANALISE],
            [StatusOS.EM_ANALISE]: [StatusOS.EM_REPARO],
            [StatusOS.EM_REPARO]: [
                StatusOS.AGUARDANDO_PECA,
                StatusOS.PRONTO,
            ],
            [StatusOS.AGUARDANDO_PECA]: [StatusOS.EM_REPARO],
            [StatusOS.PRONTO]: [StatusOS.ENTREGUE],
            [StatusOS.ENTREGUE]: [],
        };

        if (!Object.values(StatusOS).includes(novoStatus)) {
            throw new BadRequestException('Status inválido');
        }

        if (!transicoes[ordem.status].includes(novoStatus)) {
            throw new BadRequestException(
                `Não é permitido mudar de "${ordem.status}" para "${novoStatus}"`,
            );
        }

        if (
            novoStatus === StatusOS.EM_REPARO &&
            (!ordem.diagnostico ||
                ordem.valorMaoDeObra === undefined ||
                ordem.valorPecas === undefined)
        ) {
            throw new BadRequestException(
                'Registre o diagnóstico e o orçamento antes do reparo',
            );
        }

        if (
            novoStatus === StatusOS.PRONTO &&
            ordem.acoesReparo.length === 0
        ) {
            throw new BadRequestException(
                'Registre ao menos uma ação de reparo antes de concluir',
            );
        }

        ordem.status = novoStatus;
        ordem.atualizadaEm = new Date();
        return ordem;
    }
    // finalizar concerto
    finalizar(id: number): OrdemServico {
        const ordem = this.buscarPorId(id);

        if (ordem.status !== StatusOS.EM_REPARO) {
            throw new BadRequestException(
                'A OS só pode ser finalizada quando estiver em reparo',
            );
        }

        ordem.status = StatusOS.PRONTO;
        ordem.atualizadaEm = new Date();
        return ordem;
    }
}