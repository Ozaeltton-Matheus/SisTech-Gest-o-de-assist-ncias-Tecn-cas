
import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface OrdemServico {
  id: number;
  cliente: string;
  equipamento: string;
  defeitoRelatado: string;
  diagnostico?: string;
  servico?: string;
  valorMaoDeObra?: number;
  valorPecas?: number;
  status: string;
  acoesReparo: string[];
  criadaEm: string;
  atualizadaEm: string;
}

export interface CriarOrdemServico {
  cliente: string;
  equipamento: string;
  defeitoRelatado: string;
}

@Injectable({
  providedIn: 'root',
})
export class OrdensServicoService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:3000/ordens-servico';

  listar(): Observable<OrdemServico[]> {
    return this.http.get<OrdemServico[]>(this.apiUrl);
  }

  criar(dados: CriarOrdemServico): Observable<OrdemServico> {
    return this.http.post<OrdemServico>(this.apiUrl, dados);
  }
}
