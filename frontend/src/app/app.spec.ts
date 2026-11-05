import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { LoginPage } from './login';
import { WorkspacePage } from './workspace';

describe('LoginPage', () => {
  beforeEach(async () => {
    localStorage.removeItem('sistecnica-remembered-email');
    await TestBed.configureTestingModule({
      imports: [LoginPage],
      providers: [provideRouter([{ path: 'dashboard', component: LoginPage }])],
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
});
