import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'web-portal',
    pathMatch: 'full',
  },
  {
    path: 'web-portal',
    loadComponent: () => import('./web-portal/web-portal.component').then(m => m.WebPortalComponent)
  },
  {
    path: 'scanner',
    // Asegúrate de que la ruta a tu componente del escáner sea la correcta
    loadComponent: () => import('./scanner/scanner.component').then(m => m.ScannerComponent)
  }
];