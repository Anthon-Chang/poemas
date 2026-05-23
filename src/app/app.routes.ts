import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login/login.page').then(m => m.LoginPage)
  },
  {
    path: 'poemas',
    loadComponent: () =>
      import('./pages/poemas/poemas.page').then(m => m.PoemasPage),
    canActivate: [authGuard]
  },
  {
    path: 'poemas-form',
    loadComponent: () =>
      import('./pages/poema-form/poema-form.page').then(m => m.PoemaFormPage),
    canActivate: [authGuard]
  },
  {
    path: 'poemas-form/:id',
    loadComponent: () =>
      import('./pages/poema-form/poema-form.page').then(m => m.PoemaFormPage),
    canActivate: [authGuard]
  }
];
