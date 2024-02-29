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
    path: 'about-us',
    loadComponent: () => import('./features/about-us/about-us.component'),
    title: 'About us',
  },
  {
    path: 'contact',
    loadComponent: () => import('./features/contact/contact.component'),
    title: 'Contact',
  },
  {
    path: 'auth',
    title: 'Auth',
    loadComponent: () => import('./features/auth/auth.component'),
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
