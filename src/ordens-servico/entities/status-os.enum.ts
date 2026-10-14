// declara os estados possíveis de uma ordem de serviço

export enum StatusOS{
    RECEBIDO = 'Recebido',
    EM_ANALISE = 'Em Análise',
    EM_REPARO = 'Em Reparo',
    AGUARDANDO_PECA = 'Aguardando Peça',
    PRONTO = 'Pronto',
    ENTREGUE = 'Entregue',
}

