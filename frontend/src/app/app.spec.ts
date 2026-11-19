import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { LoginPage } from './login';
import { RegistrationPage } from './register';
import { RepairRequestService } from './repair-request';
import { TechnicianPage } from './technician';
import { WorkspacePage } from './workspace';

describe('LoginPage', () => {
  beforeEach(async () => {
    localStorage.removeItem('sistecnica-remembered-email');
    await TestBed.configureTestingModule({
      imports: [LoginPage],
      providers: [
        provideRouter([
          { path: 'dashboard', component: LoginPage },
          { path: 'register', component: RegistrationPage },
        ]),
      ],
    }).compileComponents();
  });

  it('should render the sign-in form', () => {
    const fixture = TestBed.createComponent(LoginPage);
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Acesse sua conta');
    expect(fixture.nativeElement.querySelector('#login-email')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('#login-password')).toBeTruthy();
  });

  it('should show validation errors when submitted empty', () => {
    const fixture = TestBed.createComponent(LoginPage);
    fixture.detectChanges();
    (fixture.nativeElement.querySelector('form') as HTMLFormElement).dispatchEvent(
      new Event('submit'),
    );
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Informe um e-mail válido.');
    expect(fixture.nativeElement.textContent).toContain('Digite uma senha');
  });

  it('should toggle password visibility', () => {
    const fixture = TestBed.createComponent(LoginPage);
    fixture.detectChanges();
    const password = fixture.nativeElement.querySelector('#login-password') as HTMLInputElement;
    (fixture.nativeElement.querySelector('[aria-label="Mostrar senha"]') as HTMLButtonElement).click();
    fixture.detectChanges();
    expect(password.type).toBe('text');
    (fixture.nativeElement.querySelector('[aria-label="Ocultar senha"]') as HTMLButtonElement).click();
    fixture.detectChanges();
    expect(password.type).toBe('password');
  });

  it('should open the dashboard after validating demo credentials', async () => {
    const fixture = TestBed.createComponent(LoginPage);
    fixture.detectChanges();
    const email = fixture.nativeElement.querySelector('#login-email') as HTMLInputElement;
    email.value = 'ana@example.com';
    email.dispatchEvent(new Event('input'));
    const password = fixture.nativeElement.querySelector('#login-password') as HTMLInputElement;
    password.value = 'senha-segura';
    password.dispatchEvent(new Event('input'));
    (fixture.nativeElement.querySelector('form') as HTMLFormElement).dispatchEvent(
      new Event('submit'),
    );
    await fixture.whenStable();

    expect(TestBed.inject(Router).url).toBe('/dashboard');
  });

  it('should validate the recovery form without claiming to send an email', () => {
    const fixture = TestBed.createComponent(LoginPage);
    fixture.detectChanges();
    Array.from(fixture.nativeElement.querySelectorAll('button') as NodeListOf<HTMLButtonElement>)
      .find((button) => button.textContent?.includes('Esqueceu a senha?'))
      ?.click();
    fixture.detectChanges();

    const email = fixture.nativeElement.querySelector('#reset-email') as HTMLInputElement;
    email.value = 'ana@example.com';
    email.dispatchEvent(new Event('input'));
    (fixture.nativeElement.querySelector('form') as HTMLFormElement).dispatchEvent(
      new Event('submit'),
    );
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Nenhum e-mail foi enviado.');
  });

  it('should open the selected profile registration form from login', () => {
    const fixture = TestBed.createComponent(LoginPage);
    fixture.detectChanges();
    const clientLink = fixture.nativeElement.querySelector(
      'a[href="/register?profile=client"]',
    ) as HTMLAnchorElement;
    expect(clientLink.textContent).toContain('Criar conta de cliente');
  });
});

describe('RegistrationPage', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegistrationPage],
      providers: [
        provideRouter([
          { path: 'register', component: RegistrationPage },
          { path: 'login', component: LoginPage },
        ]),
      ],
    }).compileComponents();
  });

  it('should require a profile before showing account fields', () => {
    const fixture = TestBed.createComponent(RegistrationPage);
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Como você deseja se cadastrar?');
    expect(fixture.nativeElement.querySelector('#register-name')).toBeNull();
    (fixture.nativeElement.querySelector('button') as HTMLButtonElement).click();
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('#register-name')).toBeTruthy();
  });

  it('should validate and complete a client demo registration', () => {
    const fixture = TestBed.createComponent(RegistrationPage);
    fixture.detectChanges();
    (fixture.nativeElement.querySelector('button') as HTMLButtonElement).click();
    fixture.detectChanges();
    (fixture.nativeElement.querySelector('form') as HTMLFormElement).dispatchEvent(
      new Event('submit', { bubbles: true, cancelable: true }),
    );
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Informe seu nome completo.');

    const values: Record<string, string> = {
      'register-name': 'Ana Costa',
      'register-document': '12345678901',
      'register-phone': '11999991234',
      'register-email': 'ana@example.com',
      'register-password': 'senha123',
      'register-confirm-password': 'senha123',
    };
    for (const [id, value] of Object.entries(values)) {
      const input = fixture.nativeElement.querySelector(`#${id}`) as HTMLInputElement;
      input.value = value;
      input.dispatchEvent(new Event('input', { bubbles: true }));
    }
    (fixture.nativeElement.querySelector('form') as HTMLFormElement).dispatchEvent(
      new Event('submit', { bubbles: true, cancelable: true }),
    );
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Cadastro demonstrativo concluído');
    expect(fixture.nativeElement.textContent).toContain('Nenhum dado foi enviado ou armazenado.');
  });

  it('should require a specialty for technician registrations', () => {
    const fixture = TestBed.createComponent(RegistrationPage);
    fixture.detectChanges();
    const technicianButton = Array.from(
      fixture.nativeElement.querySelectorAll('button') as NodeListOf<HTMLButtonElement>,
    ).find((button) => button.textContent?.includes('Continuar como técnico'));
    technicianButton?.click();
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('#register-specialty')).toBeTruthy();
    (fixture.nativeElement.querySelector('form') as HTMLFormElement).dispatchEvent(
      new Event('submit', { bubbles: true, cancelable: true }),
    );
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Selecione uma especialidade.');
  });
});

describe('TechnicianPage', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TechnicianPage],
      providers: [provideRouter([{ path: 'login', component: LoginPage }])],
    }).compileComponents();
  });

  it('should show the technician dashboard and navigate to assigned orders', () => {
    const fixture = TestBed.createComponent(TechnicianPage);
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Bom dia, Marina.');
    const ordersButton = Array.from(
      fixture.nativeElement.querySelectorAll('button') as NodeListOf<HTMLButtonElement>,
    ).find((button) => button.textContent?.includes('Minhas ordens'));
    ordersButton?.click();
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Minhas ordens de serviço');
    expect(fixture.nativeElement.textContent).toContain('OS #1048');
  });

  it('should update appointment completion in the technician schedule', () => {
    const fixture = TestBed.createComponent(TechnicianPage);
    fixture.detectChanges();
    const scheduleButton = Array.from(
      fixture.nativeElement.querySelectorAll('button') as NodeListOf<HTMLButtonElement>,
    ).find((button) => button.textContent?.includes('Minha agenda'));
    scheduleButton?.click();
    fixture.detectChanges();
    const completeButton = Array.from(
      fixture.nativeElement.querySelectorAll('button') as NodeListOf<HTMLButtonElement>,
    ).find((button) => button.textContent?.trim() === 'Concluir');
    completeButton?.click();
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Atendimento de Carla Mendes concluído.');
    expect(fixture.nativeElement.textContent).toContain('Realizado');
  });

  it('should show client repair requests in the technician orders', () => {
    TestBed.inject(RepairRequestService).submit({
      customer: 'Ana Costa',
      device: 'Notebook Dell',
      problem: 'Não liga depois de uma queda de energia.',
    });
    const fixture = TestBed.createComponent(TechnicianPage);
    fixture.detectChanges();
    const ordersButton = Array.from(
      fixture.nativeElement.querySelectorAll('button') as NodeListOf<HTMLButtonElement>,
    ).find((button) => button.textContent?.includes('Minhas ordens'));
    ordersButton?.click();
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Notebook Dell');
    expect(fixture.nativeElement.textContent).toContain('Não liga depois de uma queda de energia.');
  });
});

describe('WorkspacePage', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkspacePage],
      providers: [
        provideRouter([
          { path: 'dashboard', component: WorkspacePage },
          { path: 'clients', component: WorkspacePage },
          { path: 'devices', component: WorkspacePage },
          { path: 'technicians', component: WorkspacePage },
          { path: 'services', component: WorkspacePage },
          { path: 'orders', component: WorkspacePage },
          { path: 'appointments', component: WorkspacePage },
          { path: 'budgets', component: WorkspacePage },
          { path: 'payments', component: WorkspacePage },
          { path: 'order-detail', component: WorkspacePage },
          { path: 'portal', component: WorkspacePage },
        ]),
      ],
    }).compileComponents();
  });

  it('should show the dashboard and all main navigation sections', () => {
    const fixture = TestBed.createComponent(WorkspacePage);
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Ordens em andamento');
    expect(fixture.nativeElement.textContent).toContain('Ordens de serviço');
    expect(fixture.nativeElement.textContent).toContain('Pagamentos');
  });

  it('should navigate to every reference screen', () => {
    const fixture = TestBed.createComponent(WorkspacePage);
    fixture.detectChanges();
    const screens = [
      ['Clientes', 'Clientes cadastrados'],
      ['Aparelhos', 'Total cadastrado'],
      ['Técnicos', 'Equipe cadastrada'],
      ['Serviços', 'Serviços cadastrados'],
      ['Ordens de serviço', 'Todas'],
      ['Agendamentos', 'Agenda da semana'],
      ['Orçamentos', 'Aguardando aprovação'],
      ['Pagamentos', 'Recebido em outubro'],
    ];

    for (const [label, expected] of screens) {
      const button = Array.from(
        fixture.nativeElement.querySelectorAll('.sidebar-nav button') as NodeListOf<HTMLButtonElement>,
      ).find((item) => item.textContent?.includes(label));
      button?.click();
      fixture.detectChanges();
      expect(fixture.nativeElement.textContent).toContain(expected);
    }
  });

  it('should open an order detail and update its repair stage', async () => {
    const fixture = TestBed.createComponent(WorkspacePage);
    fixture.detectChanges();
    Array.from(
      fixture.nativeElement.querySelectorAll('.sidebar-nav button') as NodeListOf<HTMLButtonElement>,
    )
      .find((button) => button.textContent?.includes('Ordens de serviço'))
      ?.click();
    fixture.detectChanges();
    (fixture.nativeElement.querySelector('.table-action') as HTMLButtonElement).click();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Detalhe da ordem de serviço');
    const repairStage = Array.from(
      fixture.nativeElement.querySelectorAll('.progress-step') as NodeListOf<HTMLButtonElement>,
    ).find((button) => button.textContent?.includes('Em reparo'));
    repairStage?.click();
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Etapa atualizada para Em reparo.');
  });

  it('should add a client to the local list through the create form', async () => {
    const fixture = TestBed.createComponent(WorkspacePage);
    fixture.detectChanges();
    const clientButton = Array.from(
      fixture.nativeElement.querySelectorAll('.sidebar-nav button') as NodeListOf<HTMLButtonElement>,
    ).find((button) => button.textContent?.includes('Clientes'));
    clientButton?.click();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Clientes cadastrados');
    (fixture.nativeElement.querySelector('.page-heading .button') as HTMLButtonElement).click();
    fixture.detectChanges();

    const inputs = fixture.nativeElement.querySelectorAll('.dialog-fields input') as NodeListOf<HTMLInputElement>;
    inputs[0]!.value = 'Mariana Teste';
    inputs[0]!.dispatchEvent(new Event('input', { bubbles: true }));
    inputs[1]!.value = 'mariana@example.com · (11) 90000-0000';
    inputs[1]!.dispatchEvent(new Event('input', { bubbles: true }));
    fixture.detectChanges();
    (fixture.nativeElement.querySelector('.dialog-actions .button-primary') as HTMLButtonElement).click();
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Mariana Teste');
    expect(fixture.nativeElement.textContent).toContain('Registro adicionado');
  });

  it('should let the user edit a client record', () => {
    const fixture = TestBed.createComponent(WorkspacePage);
    fixture.detectChanges();
    Array.from(
      fixture.nativeElement.querySelectorAll('.sidebar-nav button') as NodeListOf<HTMLButtonElement>,
    )
      .find((button) => button.textContent?.includes('Clientes'))
      ?.click();
    fixture.detectChanges();
    (fixture.nativeElement.querySelector('.table-action') as HTMLButtonElement).click();
    fixture.detectChanges();

    const name = fixture.nativeElement.querySelector('#edit-name') as HTMLInputElement;
    name.value = 'Ana Costa Atualizada';
    name.dispatchEvent(new Event('input', { bubbles: true }));
    (fixture.nativeElement.querySelector('.selection-edit-actions .button-primary') as HTMLButtonElement).click();
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Ana Costa Atualizada');
    expect(fixture.nativeElement.textContent).toContain('Alterações salvas');
  });

  it('should require a valid amount before registering payment', () => {
    const fixture = TestBed.createComponent(WorkspacePage);
    fixture.detectChanges();
    Array.from(
      fixture.nativeElement.querySelectorAll('.sidebar-nav button') as NodeListOf<HTMLButtonElement>,
    )
      .find((button) => button.textContent?.includes('Pagamentos'))
      ?.click();
    fixture.detectChanges();
    (fixture.nativeElement.querySelector('.payment-lower .button-primary') as HTMLButtonElement).click();
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Informe um valor recebido válido.');
    const amount = fixture.nativeElement.querySelector('.payment-form-grid input[inputmode="decimal"]') as HTMLInputElement;
    amount.value = '125.50';
    amount.dispatchEvent(new Event('input', { bubbles: true }));
    (fixture.nativeElement.querySelector('.payment-lower .button-primary') as HTMLButtonElement).click();
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('R$ 125,50');
    expect(fixture.nativeElement.textContent).toContain('Recebimento confirmado');
  });

  it('should require customer consent before approving a portal budget', async () => {
    const fixture = TestBed.createComponent(WorkspacePage);
    fixture.detectChanges();
    Array.from(
      fixture.nativeElement.querySelectorAll('.sidebar-bottom button') as NodeListOf<HTMLButtonElement>,
    )
      .find((button) => button.textContent?.includes('Portal do cliente'))
      ?.click();
    await fixture.whenStable();
    fixture.detectChanges();

    (fixture.nativeElement.querySelector('.approve-panel .button-primary') as HTMLButtonElement).click();
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Marque a confirmação');
    (fixture.nativeElement.querySelector('.consent-check input') as HTMLInputElement).click();
    (fixture.nativeElement.querySelector('.approve-panel .button-primary') as HTMLButtonElement).click();
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Aprovação registrada');
  });

  it('should send a client repair request to the technician work queue', async () => {
    const fixture = TestBed.createComponent(WorkspacePage);
    fixture.detectChanges();
    Array.from(
      fixture.nativeElement.querySelectorAll('.sidebar-bottom button') as NodeListOf<HTMLButtonElement>,
    )
      .find((button) => button.textContent?.includes('Portal do cliente'))
      ?.click();
    await fixture.whenStable();
    fixture.detectChanges();

    const device = fixture.nativeElement.querySelector('#repair-device') as HTMLInputElement;
    device.value = 'Notebook Dell';
    device.dispatchEvent(new Event('input', { bubbles: true }));
    const problem = fixture.nativeElement.querySelector('#repair-problem') as HTMLTextAreaElement;
    problem.value = 'Não liga depois de uma queda de energia.';
    problem.dispatchEvent(new Event('input', { bubbles: true }));
    (fixture.nativeElement.querySelector('.repair-request-form') as HTMLFormElement).dispatchEvent(
      new Event('submit', { bubbles: true, cancelable: true }),
    );
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('OS #1050 enviada para avaliação');
    expect(TestBed.inject(RepairRequestService).requests[0]?.problem).toBe(
      'Não liga depois de uma queda de energia.',
    );
  });
});
