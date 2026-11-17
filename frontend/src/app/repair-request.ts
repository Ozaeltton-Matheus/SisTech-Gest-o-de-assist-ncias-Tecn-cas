import { Injectable } from '@angular/core';

export interface RepairRequest {
  id: string;
  customer: string;
  device: string;
  problem: string;
  status: string;
}

@Injectable({ providedIn: 'root' })
export class RepairRequestService {
  readonly requests: RepairRequest[] = [];

  submit(request: Omit<RepairRequest, 'id' | 'status'>): RepairRequest {
    const repairRequest: RepairRequest = {
      ...request,
      id: `OS #${1050 + this.requests.length}`,
      status: 'Nova solicitação',
    };
    this.requests.unshift(repairRequest);
    return repairRequest;
  }
}
