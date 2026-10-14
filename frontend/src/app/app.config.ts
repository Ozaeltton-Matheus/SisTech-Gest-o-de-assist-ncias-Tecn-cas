import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, Routes } from '@angular/router';
import { LoginPage } from './login';
import { WorkspacePage } from './workspace';

const workspaceRoutes: Routes = [
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
].map((path) => ({ path, component: WorkspacePage }));

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter([
      { path: '', pathMatch: 'full', redirectTo: 'login' },
      { path: 'login', component: LoginPage },
      ...workspaceRoutes,
      { path: '**', redirectTo: 'login' },
    ]),
  ],
};
