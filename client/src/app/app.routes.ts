import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/home/home.component'),
    title: 'Home',
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
