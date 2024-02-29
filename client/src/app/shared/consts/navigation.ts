import { Navigation } from '@app-shared/interfaces';

export const DEFAULT_HEADER_NAVIGATION: Navigation[] = [
  {
    title: 'Home',
    path: '',
  },
  {
    title: 'Scanner',
    path: 'scanner',
  },
  {
    title: 'About us',
    path: 'about-us',
  },
  {
    title: 'Contact',
    path: 'contact',
  },
];

export const AFTER_AUTH_NAVIGATION: Navigation[] = [
  {
    title: 'Settings',
    path: 'settings',
  },
];

export const BEFORE_AUTH_NAVIGATION: Navigation[] = [
  {
    title: 'Auth',
    path: 'auth',
  },
];
