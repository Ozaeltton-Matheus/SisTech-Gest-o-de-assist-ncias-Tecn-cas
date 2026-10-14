export class OrdemServico {
    id: number;
    cliente : string;
    equipamento : string;
    defeitoRelatado : string;

    diagnostico?: string;
    servico?: string;
    valorMaoDeObra?: number;
    valorPecas?: number;

    status?: StatusOS;
    acoesReparo: string[];

    criadaEm: Date;
    atualizadaEm: Date;
}