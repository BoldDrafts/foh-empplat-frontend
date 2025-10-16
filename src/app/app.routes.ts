import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/auth/login',
    pathMatch: 'full'
  },
  {
    path: 'auth/login',
    loadComponent: () =>
      import('./features/auth/presentation/pages/login/login.component').then(
        m => m.LoginComponent
      )
  },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./features/dashboard/presentation/pages/main-dashboard/main-dashboard.component').then(
        m => m.MainDashboardComponent
      ),
    canActivate: [authGuard]
  },
  {
    path: 'transfers',
    canActivate: [authGuard],
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./features/transfers/presentation/pages/transfer-list/transfer-list.component').then(
            m => m.TransferListComponent
          )
      }
    ]
  },
  {
    path: 'accounts',
    loadComponent: () =>
      import('./features/dashboard/presentation/pages/main-dashboard/main-dashboard.component').then(
        m => m.MainDashboardComponent
      ),
    canActivate: [authGuard]
  },
  {
    path: 'payroll',
    loadComponent: () =>
      import('./features/dashboard/presentation/pages/main-dashboard/main-dashboard.component').then(
        m => m.MainDashboardComponent
      ),
    canActivate: [authGuard]
  },
  {
    path: 'reports',
    loadComponent: () =>
      import('./features/dashboard/presentation/pages/main-dashboard/main-dashboard.component').then(
        m => m.MainDashboardComponent
      ),
    canActivate: [authGuard]
  },
  {
    path: '**',
    redirectTo: '/auth/login'
  }
];
