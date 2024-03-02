import { Routes } from '@angular/router';
import { canAuth } from '@app-shared/services';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/home/home.component'),
    title: 'Home',
  },
  {
    path: 'scanner',
    loadComponent: () => import('./features/scanner/scanner.component'),
    title: 'Scan QR code',
  },
  {
    path: 'scan/product/:id',
    loadComponent: () => import('./features/scan-result/scan-result.component'),
    title: 'Scan result',
  },
  {
    path: 'auth',
    title: 'Auth',
    loadComponent: () => import('./features/auth/auth.component'),
  },
  {
    path: 'settings',
    title: 'Settings',
    loadComponent: () => import('./features/settings/settings.component'),
  },
  {
    path: 'admin',
    title: 'Admin',
    loadComponent: () => import('./features/admin/admin.component'),
  },
  {
    path: '404',
    loadComponent: () => import('./features/not-found/not-found.component'),
    title: 'Page not found',
  },
  {
    path: '**',
    pathMatch: 'full',
    redirectTo: '404',
  },
];
