import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'poemas',
    pathMatch: 'full'
  },
  {
    path: 'poemas',
    loadComponent: () =>
      import('./pages/videojuegos/videojuegos.page')
        .then(m => m.VideojuegosPage)
  },
  {
    path: 'poemas-form',
    loadComponent: () =>
      import('./pages/videojuego-form/videojuego-form.page')
        .then(m => m.VideojuegoFormPage)
  },
  {
    path: 'poemas-form/:id',
    loadComponent: () =>
      import('./pages/videojuego-form/videojuego-form.page')
        .then(m => m.VideojuegoFormPage)
  }
];
