import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDividerModule } from '@angular/material/divider';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../../../../core/services/auth/auth.service.interface';
import { UserInfo, Company } from '../../../../../core/models/user.model';
import { Account } from '../../../../accounts/domain/models/account.model';

@Component({
  selector: 'app-main-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatIconModule,
    MatTableModule,
    MatSelectModule,
    MatFormFieldModule,
    MatButtonModule,
    MatMenuModule,
    MatTooltipModule,
    MatDividerModule
  ],
  templateUrl: './main-dashboard.component.html',
  styleUrls: ['./main-dashboard.component.scss']
})
export class MainDashboardComponent implements OnInit {
  userInfo: UserInfo = {
    name: '',
    dni: '',
    companyName: '',
    ruc: '',
    email: ''
  };

  companies: Company[] = [
    { code: 'TES', name: 'Tu Empresa SAC', ruc: '20123456789' },
    { code: 'FIN', name: 'FINANCIERA OH', ruc: '20987654321' }
  ];

  selectedCompany = 'FINANCIERA OH';

  accounts: Account[] = [
    {
      id: '1',
      number: '1234567890123',
      cci: '00123456789012345678',
      type: 'CHECKING',
      currency: 'PEN',
      availableBalance: 15750.50,
      retainedBalance: 2500.00,
      status: 'ACTIVO',
      company: 'FINANCIERA OH',
      createdAt: new Date()
    },
    {
      id: '2',
      number: '9876543210987',
      cci: '00198765432109876543',
      type: 'CTS',
      currency: 'PEN',
      availableBalance: 45200.00,
      retainedBalance: 0,
      status: 'ACTIVO',
      company: 'FINANCIERA OH',
      createdAt: new Date()
    }
  ];

  displayedColumns: string[] = [
    'accountNumber',
    'cci',
    'availableBalance',
    'retainedBalance',
    'currency',
    'status'
  ];

  reports = [
    { type: 'apertura-cuentas', name: 'Reporte de apertura de cuentas', icon: 'account_balance' },
    { type: 'pago-haberes', name: 'Reporte de pago de haberes', icon: 'payments' },
    { type: 'transferencias', name: 'Reporte de transferencias', icon: 'swap_horiz' },
    { type: 'movimientos', name: 'Reporte de movimientos', icon: 'list_alt' },
    { type: 'estado-cuenta', name: 'Reporte de estado de cuenta', icon: 'description' }
  ];

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadUserInfo();
  }

  loadUserInfo() {
    this.authService.getUserInfo().subscribe({
      next: (info) => {
        this.userInfo = info;
      }
    });
  }

  openReport(type: string) {
    console.log('Opening report:', type);
  }

  logout() {
    this.authService.logout().subscribe({
      next: () => {
        this.router.navigate(['/login']);
      },
      error: (error) => {
        console.error('Logout error:', error);
        this.router.navigate(['/login']);
      }
    });
  }
}
