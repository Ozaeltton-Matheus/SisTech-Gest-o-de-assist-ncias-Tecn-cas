import { OrdensServicoService, OrdemServico } from './ordens-servico.service';
import { Component, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';

type Page =
  | 'dashboard'
  | 'clients'
  | 'devices'
  | 'technicians'
  | 'services'
  | 'orders'
  | 'appointments'
  | 'budgets'
  | 'payments'
  | 'order-detail'
  | 'portal';

type ListPage = Exclude<Page, 'dashboard' | 'order-detail' | 'portal'>;

interface Item {
  id: string;
  name: string;
  detail: string;
  category: string;
  status: string;
  value: string;
  customer: string;
  date: string;
}

@Component({
  selector: 'app-workspace',
  imports: [FormsModule],
  templateUrl: './workspace.html',
})
export class WorkspacePage {
  private readonly router = inject(Router);
  private readonly ordensServicoService = inject(OrdensServicoService);
  protected activePage: Page = 'dashboard';
  protected searchTerm = '';
  protected statusFilter = 'Todos';
  protected selectedItem: Item | null = null;
  protected showCreateDialog = false;
  protected isMobileMenuOpen = false;
  protected toast = '';
  protected draft: Record<string, string> = {};
  protected portalApproved = false;
  protected portalConsent = false;
  protected notificationOpen = false;
  protected profileOpen = false;
  protected editingItemId = '';
  protected editDraft = { name: '', detail: '' };
  protected paymentAmount = '';
  protected paymentMethod = 'Pix';
  protected paymentDate = '2026-10-14';
  private toastTimer = 0;

  protected readonly navigation: { page: Page; label: string; icon: string }[] = [
    { page: 'dashboard', label: 'Dashboard', icon: '▦' },
    { page: 'clients', label: 'Clientes', icon: '♧' },
    { page: 'devices', label: 'Aparelhos', icon: '▯' },
    { page: 'technicians', label: 'Técnicos', icon: '⚒' },
    { page: 'services', label: 'Serviços', icon: '⌁' },
    { page: 'orders', label: 'Ordens de serviço', icon: '▤' },
    { page: 'appointments', label: 'Agendamentos', icon: '▦' },
    { page: 'budgets', label: 'Orçamentos', icon: '▱' },
    { page: 'payments', label: 'Pagamentos', icon: '＄' },
  ];

  protected readonly records: Record<ListPage, Item[]> = {
    clients: [
      { id: 'CLI-001', name: 'Ana Costa', detail: 'ana.costa@email.com · (11) 99912-3401', category: '4 aparelhos', status: 'Ativo', value: 'R$ 480,00', customer: 'Ana Costa', date: '12/10/2026' },
      { id: 'CLI-002', name: 'Bruno Lima', detail: 'bruno.lima@email.com · (11) 99823-4502', category: '2 aparelhos', status: 'Ativo', value: 'R$ 650,00', customer: 'Bruno Lima', date: '09/10/2026' },
      { id: 'CLI-003', name: 'Carla Mendes', detail: 'carla.mendes@email.com · (11) 99734-5603', category: '3 aparelhos', status: 'Ativo', value: 'R$ 320,00', customer: 'Carla Mendes', date: '08/10/2026' },
      { id: 'CLI-004', name: 'Diego Santos', detail: 'diego.santos@email.com · (11) 99645-6704', category: '1 aparelho', status: 'Ativo', value: 'R$ 420,00', customer: 'Diego Santos', date: '07/10/2026' },
      { id: 'CLI-005', name: 'Elisa Rocha', detail: 'elisa.rocha@email.com · (11) 99556-7805', category: '2 aparelhos', status: 'Ativo', value: 'R$ 380,00', customer: 'Elisa Rocha', date: '05/10/2026' },
      { id: 'CLI-006', name: 'Felipe Alves', detail: 'felipe.alves@email.com · (11) 99467-8906', category: '1 aparelho', status: 'Ativo', value: 'R$ 150,00', customer: 'Felipe Alves', date: '04/10/2026' },
      { id: 'CLI-007', name: 'Gabriela Nunes', detail: 'gabriela.nunes@email.com · (11) 99378-9007', category: '2 aparelhos', status: 'Ativo', value: 'R$ 300,00', customer: 'Gabriela Nunes', date: '03/10/2026' },
      { id: 'CLI-008', name: 'Henrique Melo', detail: 'henrique.melo@email.com · (11) 99289-0108', category: '1 aparelho', status: 'Inativo', value: 'R$ 0,00', customer: 'Henrique Melo', date: '01/10/2026' },
    ],
    devices: [
      { id: 'APL13-0821', name: 'iPhone 13', detail: 'Apple · Smartphone · Ana Costa', category: 'Smartphone', status: 'Na assistência', value: 'OS #1048', customer: 'Ana Costa', date: '12/10/2026' },
      { id: 'DELL-9142', name: 'Dell Inspiron 15', detail: 'Dell · Notebook · Bruno Lima', category: 'Notebook', status: 'Na assistência', value: 'OS #1047', customer: 'Bruno Lima', date: '10/10/2026' },
      { id: 'SMAS-A317', name: 'Galaxy A54', detail: 'Samsung · Smartphone · Carla Mendes', category: 'Smartphone', status: 'Disponível', value: 'OS #1046', customer: 'Carla Mendes', date: '08/10/2026' },
      { id: 'LG43-1208', name: 'Smart TV LG 43″', detail: 'LG · Televisor · Diego Santos', category: 'Televisor', status: 'Em reparo', value: 'OS #1045', customer: 'Diego Santos', date: '07/10/2026' },
      { id: 'LNV-2203', name: 'Lenovo IdeaPad 3', detail: 'Lenovo · Notebook · Elisa Rocha', category: 'Notebook', status: 'Em diagnóstico', value: 'OS #1044', customer: 'Elisa Rocha', date: '05/10/2026' },
      { id: 'PS5-6672', name: 'PlayStation 5', detail: 'Sony · Console · Felipe Alves', category: 'Console', status: 'Aguardando peça', value: 'OS #1043', customer: 'Felipe Alves', date: '04/10/2026' },
    ],
    technicians: [
      { id: 'TEC-001', name: 'Lucas Martins', detail: '(11) 99111-2201 · Notebooks e computadores', category: '2 ordens atribuídas', status: 'Em atendimento', value: '2 / 4', customer: 'Lucas Martins', date: 'Hoje' },
      { id: 'TEC-002', name: 'Marina Souza', detail: '(11) 99222-3302 · Smartphones e tablets', category: '2 ordens atribuídas', status: 'Em atendimento', value: '2 / 4', customer: 'Marina Souza', date: 'Hoje' },
      { id: 'TEC-003', name: 'Rafael Oliveira', detail: '(11) 99333-4403 · Televisores e consoles', category: '2 ordens atribuídas', status: 'Disponível', value: '2 / 4', customer: 'Rafael Oliveira', date: 'Hoje' },
      { id: 'TEC-004', name: 'Juliana Ferreira', detail: '(11) 99444-5504 · Tablets e áudio', category: '0 ordens atribuídas', status: 'Disponível', value: '0 / 4', customer: 'Juliana Ferreira', date: 'Hoje' },
    ],
    services: [
      { id: 'SER-001', name: 'Troca de tela', detail: 'Substituição de tela e testes de imagem e toque.', category: 'Smartphone', status: 'Ativo', value: 'R$ 180,00', customer: '—', date: '2 dias úteis' },
      { id: 'SER-002', name: 'Troca de SSD e instalação', detail: 'Substituição e configuração de unidade SSD.', category: 'Notebook', status: 'Ativo', value: 'R$ 200,00', customer: '—', date: '3 dias úteis' },
      { id: 'SER-003', name: 'Troca de bateria', detail: 'Substituição de bateria e teste de autonomia.', category: 'Smartphone', status: 'Ativo', value: 'R$ 120,00', customer: '—', date: '1 dia útil' },
      { id: 'SER-004', name: 'Troca de barras de LED', detail: 'Substituição do conjunto de iluminação.', category: 'Televisor', status: 'Ativo', value: 'R$ 160,00', customer: '—', date: '4 dias úteis' },
      { id: 'SER-005', name: 'Limpeza preventiva', detail: 'Limpeza interna e revisão de componentes.', category: 'Console', status: 'Ativo', value: 'R$ 150,00', customer: '—', date: '2 dias úteis' },
      { id: 'SER-006', name: 'Troca de conector de carga', detail: 'Substituição e testes de carregamento.', category: 'Tablet / áudio', status: 'Ativo', value: 'R$ 140,00', customer: '—', date: '3 dias úteis' },
    ],
    orders: [
      { id: 'OS #1048', name: 'Ana Costa', detail: 'iPhone 13 · Troca de tela', category: 'Marina Souza', status: 'Aguard. aprovação', value: 'R$ 480,00', customer: 'Ana Costa', date: '16/10/2026' },
      { id: 'OS #1047', name: 'Bruno Lima', detail: 'Dell Inspiron 15 · Reparo', category: 'Lucas Martins', status: 'Em reparo', value: 'R$ 650,00', customer: 'Bruno Lima', date: '15/10/2026' },
      { id: 'OS #1046', name: 'Carla Mendes', detail: 'Galaxy A54 · Troca de tela', category: 'Marina Souza', status: 'Concluída', value: 'R$ 320,00', customer: 'Carla Mendes', date: '14/10/2026' },
      { id: 'OS #1045', name: 'Diego Santos', detail: 'Smart TV LG 43″ · Diagnóstico', category: 'Rafael Oliveira', status: 'Aguard. peça', value: 'R$ 420,00', customer: 'Diego Santos', date: '13/10/2026' },
      { id: 'OS #1044', name: 'Elisa Rocha', detail: 'Lenovo IdeaPad 3 · Diagnóstico', category: 'Lucas Martins', status: 'Em diagnóstico', value: 'A definir', customer: 'Elisa Rocha', date: '13/10/2026' },
      { id: 'OS #1043', name: 'Felipe Alves', detail: 'PlayStation 5 · Reparo', category: 'Rafael Oliveira', status: 'Recebida', value: 'R$ 380,00', customer: 'Felipe Alves', date: '12/10/2026' },
      { id: 'OS #1042', name: 'Gabriela Nunes', detail: 'iPad 9ª geração · Reparo', category: 'Juliana Ferreira', status: 'Entregue', value: 'R$ 300,00', customer: 'Gabriela Nunes', date: '10/10/2026' },
      { id: 'OS #1041', name: 'Henrique Melo', detail: 'JBL Flip 6 · Diagnóstico', category: 'Juliana Ferreira', status: 'Cancelada', value: 'R$ 0,00', customer: 'Henrique Melo', date: '09/10/2026' },
    ],
    appointments: [
      { id: 'AGE-026', name: 'Carla Mendes', detail: 'Retirada · Galaxy A54', category: 'Marina Souza', status: 'Confirmado', value: '14:00', customer: 'Carla Mendes', date: '14/10/2026' },
      { id: 'AGE-027', name: 'Felipe Alves', detail: 'Diagnóstico · PlayStation 5', category: 'Rafael Oliveira', status: 'Confirmado', value: '10:00', customer: 'Felipe Alves', date: '14/10/2026' },
      { id: 'AGE-028', name: 'Ana Costa', detail: 'Contato sobre orçamento', category: 'Marina Souza', status: 'Pendente', value: '16:30', customer: 'Ana Costa', date: '14/10/2026' },
      { id: 'AGE-029', name: 'Bruno Lima', detail: 'Entrega de aparelho', category: 'Lucas Martins', status: 'Realizado', value: '09:00', customer: 'Bruno Lima', date: '13/10/2026' },
    ],
    budgets: [
      { id: 'ORC-048', name: 'Ana Costa', detail: 'OS #1048 · Troca de tela do iPhone 13', category: 'Enviado hoje', status: 'Pendente', value: 'R$ 480,00', customer: 'Ana Costa', date: '16/10/2026' },
      { id: 'ORC-047', name: 'Bruno Lima', detail: 'OS #1047 · Reparo de notebook', category: 'Aprovado pelo cliente', status: 'Aprovado', value: 'R$ 650,00', customer: 'Bruno Lima', date: '14/10/2026' },
      { id: 'ORC-046', name: 'Carla Mendes', detail: 'OS #1046 · Troca de tela', category: 'Aprovado · WhatsApp', status: 'Aprovado', value: 'R$ 320,00', customer: 'Carla Mendes', date: '13/10/2026' },
      { id: 'ORC-045', name: 'Diego Santos', detail: 'OS #1045 · Troca de barras de LED', category: 'Aprovado pelo cliente', status: 'Aprovado', value: 'R$ 420,00', customer: 'Diego Santos', date: '13/10/2026' },
      { id: 'ORC-041', name: 'Henrique Melo', detail: 'OS #1041 · Diagnóstico de áudio', category: 'Cliente recusou', status: 'Recusado', value: 'R$ 150,00', customer: 'Henrique Melo', date: '09/10/2026' },
    ],
    payments: [
      { id: 'PAG-048', name: 'Ana Costa', detail: 'Total do serviço · OS #1048', category: 'A definir', status: 'Pendente', value: 'R$ 480,00', customer: 'Ana Costa', date: '16/10/2026' },
      { id: 'PAG-047', name: 'Bruno Lima', detail: 'Saldo restante · OS #1047', category: 'A definir', status: 'Pendente', value: 'R$ 450,00', customer: 'Bruno Lima', date: '15/10/2026' },
      { id: 'PAG-046', name: 'Diego Santos', detail: 'Total do serviço · OS #1045', category: 'Pix', status: 'Atrasado', value: 'R$ 420,00', customer: 'Diego Santos', date: '13/10/2026' },
      { id: 'PAG-045', name: 'Carla Mendes', detail: 'Pagamento integral · OS #1046', category: 'Pix', status: 'Pago', value: 'R$ 320,00', customer: 'Carla Mendes', date: '14/10/2026' },
      { id: 'PAG-044', name: 'Bruno Lima', detail: 'Entrada · OS #1047', category: 'Pix', status: 'Pago', value: 'R$ 200,00', customer: 'Bruno Lima', date: '12/10/2026' },
      { id: 'PAG-043', name: 'Gabriela Nunes', detail: 'Pagamento integral · OS #1042', category: 'Cartão', status: 'Pago', value: 'R$ 300,00', customer: 'Gabriela Nunes', date: '10/10/2026' },
    ],
  };

  constructor() {
    this.syncPage(this.router.url);
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        takeUntilDestroyed(),
      )
      .subscribe((event) => this.syncPage((event as NavigationEnd).urlAfterRedirects));
  }

  protected get pageTitle(): string {
    if (this.activePage === 'order-detail') return 'Detalhe da ordem de serviço';
    return this.navigation.find((item) => item.page === this.activePage)?.label ?? 'Portal do cliente';
  }

  protected get pageDescription(): string {
    const descriptions: Partial<Record<Page, string>> = {
      dashboard: 'Acompanhe o movimento da sua assistência em um só lugar.',
      clients: 'Gerencie contatos, aparelhos e histórico de atendimento.',
      devices: 'Identifique cada equipamento e acompanhe seu vínculo com o cliente.',
      technicians: 'Organize sua equipe, especialidades e ordens atribuídas.',
      services: 'Gerencie serviços, valores de mão de obra e prazos.',
      orders: 'Acompanhe cada reparo da entrada à entrega ao cliente.',
      appointments: 'Planeje retiradas, recebimentos e atendimentos da equipe.',
      budgets: 'Revise orçamentos e acompanhe as aprovações dos clientes.',
      payments: 'Controle recebimentos, saldos em aberto e comprovantes.',
    };
    return descriptions[this.activePage] ?? '';
  }

  protected get filteredItems(): Item[] {
    if (!this.isListPage(this.activePage)) return [];
    const search = this.searchTerm.trim().toLocaleLowerCase('pt-BR');
    return this.records[this.activePage].filter((item) => {
      const matchesSearch =
        !search ||
        `${item.id} ${item.name} ${item.detail} ${item.category} ${item.customer}`
          .toLocaleLowerCase('pt-BR')
          .includes(search);
      const matchesStatus =
        this.statusFilter === 'Todos' || item.status.toLocaleLowerCase('pt-BR').includes(this.statusFilter.toLocaleLowerCase('pt-BR'));
      return matchesSearch && matchesStatus;
    });
  }

  protected get activeItem(): Item | null {
    if (this.selectedItem) return this.selectedItem;
    if (this.activePage === 'order-detail') return this.records.orders[0] ?? null;
    return this.filteredItems[0] ?? null;
  }

  protected get orderStageIndex(): number {
    const status = (this.activeItem?.status ?? '').toLocaleLowerCase('pt-BR');
    if (status.includes('entreg') || status.includes('conclu')) return 5;
    if (status.includes('pronto')) return 4;
    if (status.includes('reparo') || status.includes('peça')) return 3;
    if (status.includes('aprova')) return 2;
    if (status.includes('diagn')) return 1;
    return 0;
  }

  protected get createLabel(): string {
    const labels: Partial<Record<Page, string>> = {
      clients: 'Novo cliente',
      devices: 'Cadastrar aparelho',
      technicians: 'Cadastrar técnico',
      services: 'Novo serviço',
      orders: 'Nova ordem de serviço',
      appointments: 'Novo agendamento',
      budgets: 'Novo orçamento',
      payments: 'Registrar pagamento',
    };
    return labels[this.activePage] ?? 'Novo registro';
  }

  protected get createFields(): { key: string; label: string; placeholder: string }[] {
    const fields: Partial<Record<Page, { key: string; label: string; placeholder: string }[]>> = {
      clients: [
        { key: 'name', label: 'Nome completo', placeholder: 'Nome do cliente' },
        { key: 'detail', label: 'E-mail e telefone', placeholder: 'email@exemplo.com · telefone' },
      ],
      devices: [
        { key: 'name', label: 'Aparelho', placeholder: 'Marca e modelo' },
        { key: 'customer', label: 'Cliente', placeholder: 'Nome do cliente' },
        { key: 'category', label: 'Categoria', placeholder: 'Smartphone, notebook...' },
        { key: 'detail', label: 'Número de série', placeholder: 'Número de série' },
      ],
      technicians: [
        { key: 'name', label: 'Nome do técnico', placeholder: 'Nome completo' },
        { key: 'detail', label: 'Contato e especialidade', placeholder: 'Telefone · Especialidade' },
      ],
      services: [
        { key: 'name', label: 'Nome do serviço', placeholder: 'Ex.: Troca de tela' },
        { key: 'category', label: 'Categoria', placeholder: 'Ex.: Smartphone' },
        { key: 'value', label: 'Valor de mão de obra', placeholder: 'R$ 0,00' },
        { key: 'detail', label: 'Descrição e prazo', placeholder: 'Descrição do serviço e prazo' },
      ],
      orders: [
        { key: 'customer', label: 'Cliente', placeholder: 'Nome do cliente' },
        { key: 'name', label: 'Aparelho', placeholder: 'Marca e modelo' },
        { key: 'detail', label: 'Problema informado', placeholder: 'Descreva o problema' },
      ],
      appointments: [
        { key: 'customer', label: 'Cliente', placeholder: 'Nome do cliente' },
        { key: 'detail', label: 'Tipo de atendimento', placeholder: 'Recebimento, retirada...' },
        { key: 'date', label: 'Data e horário', placeholder: '14/10/2026 · 14:00' },
      ],
      budgets: [
        { key: 'customer', label: 'Cliente', placeholder: 'Nome do cliente' },
        { key: 'detail', label: 'Descrição do orçamento', placeholder: 'Serviço e peças' },
        { key: 'value', label: 'Valor total', placeholder: 'R$ 0,00' },
      ],
      payments: [
        { key: 'customer', label: 'Cliente / ordem de serviço', placeholder: 'Cliente · OS #0000' },
        { key: 'value', label: 'Valor recebido', placeholder: 'R$ 0,00' },
        { key: 'category', label: 'Forma de pagamento', placeholder: 'Pix, cartão ou dinheiro' },
        { key: 'date', label: 'Data do recebimento', placeholder: '14/10/2026' },
      ],
    };
    return fields[this.activePage] ?? [];
  }

  protected navigate(page: Page): void {
    this.searchTerm = '';
    this.statusFilter = 'Todos';
    this.selectedItem = null;
    this.activePage = page;
    this.isMobileMenuOpen = false;
    void this.router.navigateByUrl(`/${page}`);
  }

  protected updateDraft(field: string, event: Event): void {
    const target = event.target;
    if (target && 'value' in target && typeof target.value === 'string') {
      this.draft[field] = target.value;
    }
  }

  protected openCreateDialog(): void {
    this.draft = {};
    this.showCreateDialog = true;
  }

  protected closeCreateDialog(): void {
    this.showCreateDialog = false;
  }

  protected saveRecord(): void {
    if (!this.isListPage(this.activePage)) return;

    if (this.activePage === 'orders') {
      const cliente = this.draft['customer']?.trim();
      const equipamento = this.draft['name']?.trim();
      const defeitoRelatado = this.draft['detail']?.trim();

      if (!cliente || !equipamento || !defeitoRelatado) {
        this.showToast('Preencha todos os campos da ordem de serviço.');
        return;
      }

      this.ordensServicoService
        .criar({ cliente, equipamento, defeitoRelatado })
        .subscribe({
          next: (ordem) => {
            const item = this.converterOrdem(ordem);

            this.records.orders.unshift(item);
            this.selectedItem = item;
            this.showCreateDialog = false;
            this.draft = {};

            this.showToast('Ordem de serviço cadastrada com sucesso.');
          },
          error: (erro) => {
            console.error('Erro ao cadastrar ordem de serviço:', erro);
            this.showToast(
              'Não foi possível cadastrar a ordem. Confira os dados e o backend.',
            );
          },
        });

      return;
    }

    const name = this.draft['name']?.trim() || this.draft['customer']?.trim();
    if (!name) {
      this.showToast('Preencha pelo menos o nome do registro.');
      return;
    }
    const list = this.records[this.activePage];
    const row: Item = {
      id: `${this.activePage.slice(0, 3).toUpperCase()}-${String(Date.now()).slice(-4)}`,
      name,
      detail: this.draft['detail']?.trim() || this.draft['category']?.trim() || 'Registro adicionado nesta demonstração',
      category: this.draft['category']?.trim() || '—',
      status:
        this.activePage === 'payments'
          ? 'Pendente'
          : this.activePage === 'appointments'
            ? 'Confirmado'
            : this.activePage === 'orders'
              ? 'Recebida'
              : this.activePage === 'budgets'
                ? 'Pendente'
                : 'Ativo',
      value: this.draft['value']?.trim() || 'A definir',
      customer: this.draft['customer']?.trim() || name,
      date: this.draft['date']?.trim() || '14/10/2026',
    };
    list.unshift(row);
    this.selectedItem = row;
    this.showCreateDialog = false;
    this.showToast('Registro adicionado à lista desta demonstração.');
  }


  private carregarOrdens(): void {
    this.ordensServicoService.listar().subscribe({
      next: (ordens) => {
        const itens = ordens.map((ordem) => this.converterOrdem(ordem));

        this.records.orders.splice(
          0,
          this.records.orders.length,
          ...itens,
        );
      },
      error: () => {
        this.showToast(
          'Não foi possível carregar as ordens. Verifique se o backend está ativo.',
        );
      },
    });
  }

  private converterOrdem(ordem: OrdemServico): Item {
    const statusMap: Record<string, string> = {
      RECEBIDO: 'Recebida',
      EM_ANALISE: 'Em diagnóstico',
      EM_REPARO: 'Em reparo',
      AGUARDANDO_PECA: 'Aguardando peça',
      PRONTO: 'Pronta',
      ENTREGUE: 'Entregue',
    };

    const valorTotal =
      (ordem.valorMaoDeObra ?? 0) + (ordem.valorPecas ?? 0);

    return {
      id: `OS #${ordem.id}`,
      name: ordem.cliente,
      detail: `${ordem.equipamento} · ${ordem.defeitoRelatado}`,
      category: ordem.diagnostico ?? 'Sem diagnóstico',
      status: statusMap[ordem.status] ?? ordem.status ?? 'Recebida',
      value:
        ordem.valorMaoDeObra !== undefined ||
          ordem.valorPecas !== undefined
          ? valorTotal.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL',
          })
          : 'A definir',
      customer: ordem.cliente,
      date: new Date(ordem.criadaEm).toLocaleDateString('pt-BR'),
    };
  }


  protected chooseItem(item: Item): void {
    this.selectedItem = item;
  }

  protected startEdit(item: Item): void {
    this.selectedItem = item;
    this.editingItemId = item.id;
    this.editDraft = { name: item.name, detail: item.detail };
  }

  protected updateEditDraft(field: 'name' | 'detail', event: Event): void {
    const target = event.target;
    if (target && 'value' in target && typeof target.value === 'string') {
      this.editDraft[field] = target.value;
    }
  }

  protected saveEdit(item: Item): void {
    const name = this.editDraft.name.trim();
    if (!name) {
      this.showToast('O nome do registro não pode ficar vazio.');
      return;
    }

    item.name = name;
    item.detail = this.editDraft.detail.trim();
    this.editingItemId = '';
    this.showToast('Alterações salvas nesta demonstração.');
  }

  protected cancelEdit(): void {
    this.editingItemId = '';
  }

  protected openOrder(item: Item): void {
    this.selectedItem = item;
    void this.router.navigateByUrl('/order-detail');
  }

  protected updateStatus(item: Item, status: string, message: string): void {
    item.status = status;
    this.selectedItem = item;
    this.showToast(message);
  }

  protected approveBudget(item: Item): void {
    this.updateStatus(item, 'Aprovado', `${item.id} aprovado nesta demonstração.`);
  }

  protected rejectBudget(item: Item): void {
    this.updateStatus(item, 'Recusado', `${item.id} marcado como recusado.`);
  }

  protected confirmPayment(): void {
    const amount = Number(this.paymentAmount.trim().replace(',', '.'));
    if (!Number.isFinite(amount) || amount <= 0) {
      this.showToast('Informe um valor recebido válido.');
      return;
    }

    const payment = this.activeItem;
    if (!payment || !this.isListPage(this.activePage) || this.activePage !== 'payments') {
      this.showToast('Selecione um pagamento antes de registrar o recebimento.');
      return;
    }

    payment.value = amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    payment.category = this.paymentMethod;
    payment.date = new Date(`${this.paymentDate}T12:00:00`).toLocaleDateString('pt-BR');
    this.updateStatus(payment, 'Pago', 'Recebimento confirmado nesta demonstração.');
    this.paymentAmount = '';
  }

  protected selectPayment(item: Item): void {
    this.selectedItem = item;
    this.showToast('Pagamento selecionado. Informe o valor recebido para confirmar.');
  }

  protected setPortalConsent(event: Event): void {
    const target = event.target;
    if (target && 'checked' in target && typeof target.checked === 'boolean') {
      this.portalConsent = target.checked;
    }
  }

  protected approvePortalBudget(): void {
    if (!this.portalConsent) {
      this.showToast('Marque a confirmação do orçamento antes de aprovar.');
      return;
    }

    this.portalApproved = true;
    this.showToast('Aprovação registrada nesta demonstração.');
  }

  protected printPage(): void {
    window.print();
  }

  protected exportRecords(): void {
    if (!this.isListPage(this.activePage)) return;

    const rows = [
      ['Código', 'Nome', 'Detalhes', 'Categoria', 'Situação', 'Valor', 'Cliente', 'Data'],
      ...this.filteredItems.map((item) => [
        item.id,
        item.name,
        item.detail,
        item.category,
        item.status,
        item.value,
        item.customer,
        item.date,
      ]),
    ];
    const csv = `\uFEFF${rows
      .map((row) =>
        row.map((value) => `"${value.replaceAll('"', '""')}"`).join(';'),
      )
      .join('\r\n')}`;
    const link = document.createElement('a');
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
    link.href = url;
    link.download = `sistecnica-${this.activePage}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    this.showToast(`${this.filteredItems.length} registros exportados para CSV.`);
  }

  protected logout(): void {
    void this.router.navigateByUrl('/login');
  }

  protected statusClass(status: string): string {
    const normalized = status.toLocaleLowerCase('pt-BR');
    if (normalized.includes('aprov') || normalized.includes('pago') || normalized.includes('conclu') || normalized.includes('entreg') || normalized.includes('realizado') || normalized === 'ativo') {
      return 'badge badge-green';
    }
    if (normalized.includes('atras') || normalized.includes('recus') || normalized.includes('cancel')) return 'badge badge-red';
    if (normalized.includes('pend') || normalized.includes('aguard')) return 'badge badge-amber';
    if (normalized.includes('reparo') || normalized.includes('diagn') || normalized.includes('atendimento')) return 'badge badge-blue';
    return 'badge badge-gray';
  }

  protected showToast(message: string): void {
    this.toast = message;
    window.clearTimeout(this.toastTimer);
    this.toastTimer = window.setTimeout(() => {
      this.toast = '';
    }, 3200);
  }

  protected toggleNotifications(): void {
    this.notificationOpen = !this.notificationOpen;
    this.profileOpen = false;
  }

  protected toggleProfile(): void {
    this.profileOpen = !this.profileOpen;
    this.notificationOpen = false;
  }

  private syncPage(url: string): void {
    const path = url.split('?')[0]?.split('/')[1] ?? 'dashboard';
    const pages: Page[] = [
      'dashboard',
      'clients',
      'devices',
      'technicians',
      'services',
      'orders',
      'appointments',
      'budgets',
      'payments',
      'order-detail',
      'portal',
    ];
    this.activePage = pages.includes(path as Page) ? (path as Page) : 'dashboard';
    if (this.activePage === 'orders') {
      this.carregarOrdens();
    }
    if (this.activePage !== 'order-detail') {
      this.selectedItem = null;
    }
    this.searchTerm = '';
    this.statusFilter = 'Todos';
  }

  private isListPage(page: Page): page is ListPage {
    return page !== 'dashboard' && page !== 'order-detail' && page !== 'portal';
  }
}
