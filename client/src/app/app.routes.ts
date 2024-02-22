import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/home/home.component'),
    title: 'მთავარი',
  },
  {
    path: '404',
    loadComponent: () => import('./features/not-found/not-found.component'),
    title: 'გვერდი ვერ მოიძებნა',
  },
  {
    path: '**',
    pathMatch: 'full',
    redirectTo: '404',
  },
];
