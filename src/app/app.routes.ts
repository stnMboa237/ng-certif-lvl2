import { Routes } from '@angular/router';

export const footballRoutes: Routes = [
  { path: '', loadComponent: () => import('./core/home'), pathMatch: 'full' },
  {
    path: 'standing/:country',
    loadComponent: () => import('./core/features/standing'),
  },
  {
    path: 'fixtures/:id',
    loadComponent: () => import('./core/features/fixtures'),
  },
  { path: '**', redirectTo: '' },
];
