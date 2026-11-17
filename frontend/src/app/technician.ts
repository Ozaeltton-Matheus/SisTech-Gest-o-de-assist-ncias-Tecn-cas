import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { RepairRequestService } from './repair-request';

type TechnicianView = 'home' | 'orders' | 'schedule' | 'profile';

interface TechnicianOrder {
  id: string;
  device: string;
  customer: string;
  status: string;
  detail: string;
}

@Component({
  selector: 'app-technician',
  imports: [FormsModule, RouterLink],
  templateUrl: './technician.html',
})
export class TechnicianPage {
  private readonly repairRequests = inject(RepairRequestService);
  protected activeView: TechnicianView = 'home';
  protected toast = '';
  protected readonly technicianName = 'Marina Souza';
  protected readonly menu: { id: TechnicianView; label: string; icon: string }[] = [
    { id: 'home', label: 'Início', icon: '▦' },
    { id: 'orders', label: 'Minhas ordens', icon: '▤' },
    { id: 'schedule', label: 'Minha agenda', icon: '▣' },
    { id: 'profile', label: 'Perfil e especialidades', icon: '♙' },
  ];

  private readonly demoOrders: TechnicianOrder[] = [
    {
      id: 'OS #1048',
      device: 'iPhone 13',
      customer: 'Ana Costa',
      status: 'Aguardando aprovação',
      detail:
        'Diagnóstico concluído às 11:40: tela danificada pelo impacto, com falhas no toque. Troca do conjunto de tela e vedação proposta.',
    },
    {
      id: 'OS #1046',
      device: 'Galaxy A54',
      customer: 'Carla Mendes',
      status: 'Concluída',
      detail: 'Troca de tela finalizada. Equipamento testado e pronto para retirada.',
    },
  ];

  protected get orders(): TechnicianOrder[] {
    return [
      ...this.repairRequests.requests.map((request) => ({
        id: request.id,
        device: request.device,
        customer: request.customer,
        status: request.status,
        detail: request.problem,
      })),
      ...this.demoOrders,
    ];
  }

  protected appointments = [
    { time: '14:00', customer: 'Carla Mendes', order: 'OS #1046', status: 'Retirada' },
    { time: '16:30', customer: 'Ana Costa', order: 'OS #1048', status: 'Contato' },
  ];

  protected profileName = this.technicianName;
  protected specialty = 'Smartphones e tablets';

  protected get pageTitle(): string {
    return this.menu.find((item) => item.id === this.activeView)?.label ?? 'Início';
  }

  protected openView(view: TechnicianView): void {
    this.activeView = view;
    this.toast = '';
  }

  protected updateOrderStatus(order: TechnicianOrder, status: string): void {
    order.status = status;
    this.showToast(`${order.id} atualizado para "${status}".`);
  }

  protected completeAppointment(appointment: (typeof this.appointments)[number]): void {
    appointment.status = 'Realizado';
    this.showToast(`Atendimento de ${appointment.customer} concluído.`);
  }

  protected saveProfile(): void {
    if (!this.profileName.trim() || !this.specialty) {
      this.showToast('Informe seu nome e uma especialidade para salvar.');
      return;
    }
    this.showToast('Perfil atualizado nesta demonstração.');
  }

  protected showToast(message: string): void {
    this.toast = message;
  }
}
